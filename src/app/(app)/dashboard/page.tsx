"use client"
import React, { useCallback, useEffect, useState } from "react";
import { Message } from "@/models/user.model"
import { useToast } from "@/components/ui/use-toast";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { acceptMessagesSchema } from "@/schemas/acceptMessageSchema";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { User } from "next-auth";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Loader2, RefreshCcw } from "lucide-react";
import MessageCard from "@/components/MessageCard";

const Dashboard = () => {
    const [ messages, setMessages ] = useState<Message[]>()
    // loading state when I am fetching messages
    const [ isLoading, setIsLoading ] = useState(false)
    // state change of button
    const [ isSwitchLoading, setIsSwitchLoading] = useState(false)
    const { toast } = useToast()

    // optimistic UI (updating UI first)
    // ex when you like the post on instagram, it instently show its been like, but its not sure, like is 
    // been added in backend as well, bz it takes time, for that time, it shows on screen that like is perform,
    // if success its like keep shown on screen, otherwise it will revert it action on frontend

    const handleDeleteMessage = (messageId: string) => {
        setMessages(messages?.filter((message) => message._id !== messageId))

    }

    const { data: session } = useSession()

    const form = useForm({
        resolver: zodResolver(acceptMessagesSchema)
    })

    const { register, watch, setValue } = form

    const acceptMessages = watch('acceptMessages')

    // actual api calls, all call will be done in useCallback hook
    // single message is fetched
    const fetchAcceptMessage = useCallback(async () => {
        setIsSwitchLoading(true)
        try {
            const response = await axios.get<ApiResponse>('/api/accept-messages')
            setValue('acceptMessages', response.data.isAcceptingMessage)
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>
            toast({
                title: "Error",
                description: axiosError.response?.data.message || "Failed to fetch message settings ",
                variant: "destructive"
            })
        }finally{
            setIsSwitchLoading(false)
        }
    }, [setValue])

    // fetching all messages
    const fetchMessages = useCallback( async (refresh: boolean = false ) => {
        setIsLoading(true)
        setIsSwitchLoading(true)
        try {
            const response = await axios.get<ApiResponse>('/api/get-messages')
            setMessages(response.data.messages || [])
            if(refresh){
                toast({
                    title: "Refreshed messages",
                    description: "Showing latest messages"
                })
            }
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>
            toast({
                title: "Error",
                description: axiosError.response?.data.message || "Failed to fetch message settings ",
                variant: "destructive"
            })
        } finally{
            setIsLoading(false)
            setIsSwitchLoading(false)
        }
        
    }, [setIsLoading, setMessages])


    useEffect(()=>{
        if(!session || !session.user) return
        fetchMessages()
        fetchAcceptMessage()
    },[session, setValue, fetchMessages, fetchAcceptMessage])
    // you have staate of user, but didn't changed it
    const handleSwitchChange = async() => {
        try {
            const response = await axios.post<ApiResponse>('/api/accept-messages', {
                acceptMessages: !acceptMessages
            })
            // value will be change in UI
            setValue('acceptMessages',!acceptMessages)
            toast({
                title: response.data.message,
                variant: "default"
            })
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>
            toast({
                title: "Error",
                description: axiosError.response?.data.message || "Failed to fetch message settings ",
                variant: "destructive"
            })
        }
    }

    const {username} = session?.user as User
    //1) host url or based url => where user is (local, versel, etc)
    // TODO-> do more research
    const baseUrl = `${window.location.protocol}//${window.location.host}`
    // 2) true feedback
    const profileUrl = `${baseUrl}/u/${username}`

    // copy to clipboard
    const copyToClipboard = () => {
        navigator.clipboard.writeText(profileUrl)
        toast({
            title: "URL copied ",
            description: "ProfileUrl has been copied to clipboard"
        })
    }


    // double return
    if(!session || !session.user){
        return <div>Please Login</div>
    }
    return(
        <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
      <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>

      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>{' '}
        <div className="flex items-center">
          <input
            type="text"
            value={profileUrl}
            disabled
            className="input input-bordered w-full p-2 mr-2"
          />
          <Button onClick={copyToClipboard}>Copy</Button>
        </div>
      </div>

      <div className="mb-4">
        <Switch
          {...register('acceptMessages')}
          checked={acceptMessages}
          onCheckedChange={handleSwitchChange}
          disabled={isSwitchLoading}
        />
        <span className="ml-2">
          Accept Messages: {acceptMessages ? 'On' : 'Off'}
        </span>
      </div>
      <Separator />

      <Button
        className="mt-4"
        variant="outline"
        onClick={(e) => {
          e.preventDefault();
          fetchMessages(true);
        }}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <RefreshCcw className="h-4 w-4" />
        )}
      </Button>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        {messages?.length > 0 ? (
          messages?.map((message, index) => (
            <MessageCard
              key={message._id}
              message={message}
              onMessageDelete={handleDeleteMessage}
            />
          ))
        ) : (
          <p>No messages to display.</p>
        )}
      </div>
    </div>
    )
}

export default Dashboard