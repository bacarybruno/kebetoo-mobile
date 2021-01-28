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
          let values = []
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
  }, [roomId, profile.uid])

  useEffect(() => {
    onlineRef.set({
      status: true,
      date: Date.now()
    })
    onlineRef
      .onDisconnect()
      .set({
        status: false,
        date: Date.now()
      })
  }, [profile])

  useEffect(() => {
    try {
      roomsRef.on('value', (data) => {
        const values = data.val()
        const roomsVal = Object.keys(values).map((key) => ({ id: key, ...values[key] }))
        let newRooms = []
        let newDiscoverRooms = []
        roomsVal.forEach((room) => {
          if (room.members && room.members[profile.uid]) {
            newRooms = [...newRooms, room]
          } else {
            newDiscoverRooms = [...newDiscoverRooms, room]
          }
        })
        setRooms(newRooms)
        setDiscoverRooms(newDiscoverRooms)
      })
    } catch (error) {
      console.log(error)
    }
  }, [roomsRef, profile.uid])

  const createRoom = useCallback(async ({ name, theme }) => {
    const newRoom = roomsRef.push()
    await newRoom.set({
      name,
      theme,
      createdAt: new Date().toISOString(),
      author: {
        displayName: profile.displayName,
        uid: profile.uid,
        photoURL: profile.photoURL,
      },
      members: {
        [profile.uid]: Date.now()
      },
      lastMessage: null,
      _id: newRoom.key,
    })
    await createMessage({
      text: systemMessages.ROOM_CREATED,
      system: true,
      room: newRoom.key,
    })
  }, [profile, createMessage])

  const createMessage = useCallback(async ({ room, text, audio, ...other }) => {
    const newMessage = messagesRef.child(`/${room}`).push()
    const createdAt = Date.now()
    // create the message
    // must follow this format: https://github.com/FaridSafi/react-native-gifted-chat#message-object
    const user = {
      _id: profile.uid,
      name: profile.displayName,
      avatar: profile.photoURL
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
        for (let i = 0; i < updatedState.length; i++) {
          const m = updatedState[i]
          if (m._id === message._id) {
            m.received = true
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
      roomMembers.ref.set({ [profile.uid]: Date.now() })
    }
  }, [profile, messages])

  return {
    rooms,
    messages,
    onlineCount,
    discoverRooms,
    createRoom,
    createMessage,
  }
}

export default useRooms
