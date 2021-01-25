import { useCallback, useEffect, useState } from 'react'
import database from '@react-native-firebase/database'
import { useUser } from '@app/shared/hooks'

const roomsPath = '/rooms'
const messagesPath = '/messages'

const useRooms = () => {
  const [roomsRef] = useState(database().ref(roomsPath))
  const [messagesRef] = useState(database().ref(messagesPath))
  const { profile } = useUser()

  const createRoom = useCallback(async ({ name, theme }) => {
    const newRoom = roomsRef.push()
    await newRoom.set({
      name,
      theme,
      createdAt: new Date().toISOString(),
      author: profile.uid,
      members: [profile.uid],
      lastMessage: null,
    })
  }, [])

  const createMessage = useCallback((message) => {
    messagesRef.push({
      ...message,
      createdAt: new Date(),
    })
  }, [])

  return {
    createRoom,
    createMessage,
  }
}

export default useRooms
