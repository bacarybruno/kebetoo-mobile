import { useCallback, useEffect, useState } from 'react'
import database from '@react-native-firebase/database'

import { useUser } from '@app/shared/hooks'

const roomsPath = '/rooms'
const messagesPath = '/messages'
const onlinePath = '/online'

const systemMessages = {
  ROOM_CREATED: 'SYSTEM_ROOM_CREATED',
}

const useRooms = (roomId) => {
  const { profile } = useUser()
  const [roomsRef] = useState(database().ref(roomsPath))
  const [messagesRef] = useState(database().ref(messagesPath))
  const [onlineRef] = useState(database().ref(`${onlinePath}/${profile.uid}`))
  const [rooms, setRooms] = useState([])
  const [messages, setMessages] = useState([])
  const [discoverRooms, setDiscoverRooms] = useState([])
  const [onlineCount, setOnlineCount] = useState(0)

  useEffect(() => {
    if (roomId) {
      // get last 1000 messages
      messagesRef
        .child(roomId)
        .orderByChild('createdAt')
        .limitToLast(1000)
        .once('value', (snapshot) => {
          const values = []
          snapshot.forEach((child) => {
            values.unshift({ ...child.val(), received: true })
          })
          setMessages(values)
        })
      // appemd a message everytime a new one is created
      messagesRef
        .child(roomId)
        .orderByChild('createdAt')
        .startAt(Date.now())
        .on('child_added', (snapshot) => {
          const snapshotVal = {
            ...snapshot.val(),
            sent: true,
          }
          setMessages((oldState) => [snapshotVal, ...oldState])
        })
      // mark user as online in the room
      roomsRef
        .child(`/${roomId}/online/${profile.uid}`)
        .set(true)
      // mark user as offline on disconnect
      roomsRef
        .child(`/${roomId}/online/${profile.uid}`)
        .onDisconnect()
        .remove()
      // get the number of online users in the current room
      roomsRef
        .child(`/${roomId}/online`)
        .on('value', (snapshot) => {
          if (snapshot.val()) {
            setOnlineCount(Object.keys(snapshot.val()).length)
          } else {
            setOnlineCount(0)
          }
        })
    }
  }, [roomId, profile.uid, messagesRef, roomsRef])

  useEffect(() => {
    onlineRef.set({
      status: true,
      date: Date.now(),
    })
    onlineRef
      .onDisconnect()
      .set({
        status: false,
        date: Date.now(),
      })
  }, [onlineRef, profile])

  useEffect(() => {
    try {
      roomsRef.on('value', (data) => {
        const values = data.val()
        if (!values) return
        const roomsVal = Object.keys(values).map((key) => ({ id: key, ...values[key] }))
        const newRooms = []
        const newDiscoverRooms = []
        roomsVal.forEach((room) => {
          if (room.members && room.members[profile.uid]) {
            newRooms.unshift(room)
          } else {
            newDiscoverRooms.unshift(room)
          }
        })
        setRooms(newRooms)
        setDiscoverRooms(newDiscoverRooms)
      })
    } catch (error) {
      console.log(error)
    }
  }, [roomsRef, profile.uid])

  const quitRoom = useCallback(async () => {
    await roomsRef.child(`/${roomId}/members/${profile.uid}`).ref.remove()
    const roomMembers = await roomsRef.child(`/${roomId}/members`).once('value')
    if (roomMembers.exists() === false) {
      // the deleted member was the last one
      // the room must be deleted
      // gg BoeD
      await roomsRef.child(roomId).remove()
      // also delete messages
      await messagesRef.child(roomId).remove()
    }
  }, [messagesRef, profile.uid, roomId, roomsRef])

  const createMessage = useCallback(async ({
    room, text, audio, ...other
  }) => {
    const newMessage = messagesRef.child(`/${room}`).push()
    const createdAt = Date.now()
    // create the message
    // must follow this format: https://github.com/FaridSafi/react-native-gifted-chat#message-object
    const user = {
      _id: profile.uid,
      name: profile.displayName,
      avatar: profile.photoURL,
    }
    const message = {
      _id: newMessage.key,
      text: text || null,
      audio: audio || null,
      createdAt,
      user,
      ...other,
    }
    await newMessage.set(message, () => {
      setMessages((oldState) => {
        const updatedState = [...oldState]
        for (let i = 0; i < updatedState.length; i += 1) {
          const pendingMessage = updatedState[i]
          // eslint-disable-next-line no-underscore-dangle
          if (pendingMessage._id === message._id) {
            pendingMessage.received = true
          }
        }
        return updatedState
      })
    })

    // set last message
    roomsRef.child(`/${room}/lastMessage`).set(message)

    const roomMembers = await roomsRef.child(`/${room}/members`).once('value')
    const isMember = roomMembers.hasChild(profile.uid)
    // add user in the room when he sent a message to that room
    if (!isMember) {
      roomMembers.ref.update({ [profile.uid]: Date.now() })
    }
  }, [messagesRef, profile, roomsRef])

  const createRoom = useCallback(async ({ name, theme }) => {
    const newRoom = roomsRef.push()
    const roomInfos = {
      name,
      theme,
      createdAt: new Date().toISOString(),
      author: {
        displayName: profile.displayName,
        uid: profile.uid,
        photoURL: profile.photoURL,
      },
      members: {
        [profile.uid]: Date.now(),
      },
      lastMessage: null,
      _id: newRoom.key,
    }
    await newRoom.set(roomInfos)
    await createMessage({
      text: systemMessages.ROOM_CREATED,
      system: true,
      room: newRoom.key,
    })
    return (await roomsRef.child(newRoom.key).once('value')).val()
  }, [roomsRef, profile, createMessage])

  return {
    rooms,
    messages,
    onlineCount,
    discoverRooms,
    quitRoom,
    createRoom,
    createMessage,
  }
}

export default useRooms
