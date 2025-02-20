"use client"

import { useState } from "react"
import { Textarea } from "@/components/ui/textarea"
import { MessageCircle, Send } from "lucide-react"

export default function Feedback() {

  

  return (
    <>
      <Button className="fixed bottom-4 right-4 rounded-full p-4" onClick={() => setIsOpen(true)}>
        <MessageCircle className="h-6 w-6" />
      </Button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">Teacher Feedback</h2>
            <Textarea
              placeholder="Enter your feedback here..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="w-full mb-4"
              rows={5}
            />
            <div className="flex justify-end">
              <Button variant="outline" className="mr-2" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSubmit}>
                <Send className="h-4 w-4 mr-2" />
                Send Feedback
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

