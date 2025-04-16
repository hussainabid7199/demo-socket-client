'use client'

import React, { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { User } from 'lucide-react'
import { UserBasicDto } from '@/dtos/user-dto'

interface Props {
  users: UserBasicDto[]
  open: boolean
  onClose: () => void
  onSelect: (user: UserBasicDto) => void
}

export const UserSearchModal: React.FC<Props> = ({ users, open, onClose, onSelect }) => {
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')

  // debounce logic
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search)
    }, 300)

    return () => clearTimeout(handler)
  }, [search])

  const lowerSearch = debouncedSearch.toLowerCase().trim()

  const filteredUsers = users.filter(user => {
    const fullName = `${user.firstName ?? ''} ${user.lastName ?? ''}`.toLowerCase()
    const email = user.email?.toLowerCase() ?? ''
    return fullName.includes(lowerSearch) || email.includes(lowerSearch)
  })

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Select a user</DialogTitle>
        </DialogHeader>
        <Input
          placeholder="Search by name or email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mb-4"
        />
        <ScrollArea className="h-60">
          <div className="space-y-2">
            {filteredUsers.length === 0 ? (
              <p className="text-sm text-muted-foreground">No users found</p>
            ) : (
              filteredUsers.map(user => (
                <Button
                  key={user.id}
                  variant="ghost"
                  className="w-full justify-start text-left"
                  onClick={() => {
                    console.log("onSelect", user)
                    onSelect(user)
                    onClose()
                  }}
                >
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <div className="flex flex-col">
                      <span>{`${user.firstName} ${user.lastName}`}</span>
                      <span className="text-xs text-muted-foreground">{user.email}</span>
                    </div>
                  </div>
                </Button>
              ))
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
