"use client"
import { ScrollArea } from "./ui/scroll-area"
import { Checkbox } from "./ui/checkbox"
import { Card } from "./ui/card"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"
import { useState } from "react"
import { Button } from "./ui/button"
import { Calendar as CalendarIcon } from "lucide-react"
import { Calendar } from "./ui/calendar"
import { format } from "date-fns"

const ToDoList = () => {

    const [date, setDate] = useState<Date | undefined>(new Date())
    const [open, setOpen] = useState<boolean>(false)

    return (
        <div>
            <h1 className="text-lg font-medium mb-6">To Do List</h1>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button className="w-full">
                        <CalendarIcon />
                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0 w-auto">
                    <Calendar
                        mode="single"
                        selected={date}
                        onSelect={(date) => {
                            setDate(date)
                            setOpen(false)
                        }}
                        className="rounded-lg border"
                    />
                </PopoverContent>
            </Popover>
            
            {/* List */}
            <ScrollArea className="max-h-[480px] mt-4 overflow-y-auto">
                <div className="flex flex-col gap-2">
                {/* List Items */}
                <Card className="p-4">
                    <div className="flex items-center gap-2">
                        <Checkbox id="item1"/>
                        <label htmlFor="checkbox" className="text-sm text-muted-foreground"> Lorem Ipsum Dolor Yessir</label>
                    </div>
                </Card>
                 {/* List Items */}
                <Card className="p-4">
                    <div className="flex items-center gap-2">
                        <Checkbox id="item1"/>
                        <label htmlFor="checkbox" className="text-sm text-muted-foreground"> Lorem Ipsum Dolor Yessir</label>
                    </div>
                </Card>
                 {/* List Items */}
                <Card className="p-4">
                    <div className="flex items-center gap-2">
                        <Checkbox id="item1"/>
                        <label htmlFor="checkbox" className="text-sm text-muted-foreground"> Lorem Ipsum Dolor Yessir</label>
                    </div>
                </Card>
                 {/* List Items */}
                <Card className="p-4">
                    <div className="flex items-center gap-2">
                        <Checkbox id="item1"/>
                        <label htmlFor="checkbox" className="text-sm text-muted-foreground"> Lorem Ipsum Dolor Yessir</label>
                    </div>
                </Card>
                 {/* List Items */}
                <Card className="p-4">
                    <div className="flex items-center gap-2">
                        <Checkbox id="item1"/>
                        <label htmlFor="checkbox" className="text-sm text-muted-foreground"> Lorem Ipsum Dolor Yessir</label>
                    </div>
                </Card>
                 {/* List Items */}
                <Card className="p-4">
                    <div className="flex items-center gap-2">
                        <Checkbox id="item1"/>
                        <label htmlFor="checkbox" className="text-sm text-muted-foreground"> Lorem Ipsum Dolor Yessir</label>
                    </div>
                </Card>
                 {/* List Items */}
                <Card className="p-4">
                    <div className="flex items-center gap-2">
                        <Checkbox id="item1"/>
                        <label htmlFor="checkbox" className="text-sm text-muted-foreground"> Lorem Ipsum Dolor Yessir</label>
                    </div>
                </Card>
                 {/* List Items */}
                <Card className="p-4">
                    <div className="flex items-center gap-2">
                        <Checkbox id="item1"/>
                        <label htmlFor="checkbox" className="text-sm text-muted-foreground"> Lorem Ipsum Dolor Yessir</label>
                    </div>
                </Card>
                 {/* List Items */}
                <Card className="p-4">
                    <div className="flex items-center gap-2">
                        <Checkbox id="item1"/>
                        <label htmlFor="checkbox" className="text-sm text-muted-foreground"> Lorem Ipsum Dolor Yessir</label>
                    </div>
                </Card>
                 {/* List Items */}
                <Card className="p-4">
                    <div className="flex items-center gap-2">
                        <Checkbox id="item1"/>
                        <label htmlFor="checkbox" className="text-sm text-muted-foreground"> Lorem Ipsum Dolor Yessir</label>
                    </div>
                </Card>
                 {/* List Items */}
                <Card className="p-4">
                    <div className="flex items-center gap-2">
                        <Checkbox id="item1"/>
                        <label htmlFor="checkbox" className="text-sm text-muted-foreground"> Lorem Ipsum Dolor Yessir</label>
                    </div>
                </Card>
                 {/* List Items */}
                <Card className="p-4">
                    <div className="flex items-center gap-2">
                        <Checkbox id="item1"/>
                        <label htmlFor="checkbox" className="text-sm text-muted-foreground"> Lorem Ipsum Dolor Yessir</label>
                    </div>
                </Card>
                 {/* List Items */}
                <Card className="p-4">
                    <div className="flex items-center gap-2">
                        <Checkbox id="item1"/>
                        <label htmlFor="checkbox" className="text-sm text-muted-foreground"> Lorem Ipsum Dolor Yessir</label>
                    </div>
                </Card>
                 {/* List Items */}
                <Card className="p-4">
                    <div className="flex items-center gap-2">
                        <Checkbox id="item1"/>
                        <label htmlFor="checkbox" className="text-sm text-muted-foreground"> Lorem Ipsum Dolor Yessir</label>
                    </div>
                </Card>
                 {/* List Items */}
                <Card className="p-4">
                    <div className="flex items-center gap-2">
                        <Checkbox id="item1"/>
                        <label htmlFor="checkbox" className="text-sm text-muted-foreground"> Lorem Ipsum Dolor Yessir</label>
                    </div>
                </Card>
                 {/* List Items */}
                <Card className="p-4">
                    <div className="flex items-center gap-2">
                        <Checkbox id="item1"/>
                        <label htmlFor="checkbox" className="text-sm text-muted-foreground"> Lorem Ipsum Dolor Yessir</label>
                    </div>
                </Card>
                 {/* List Items */}
                <Card className="p-4">
                    <div className="flex items-center gap-2">
                        <Checkbox id="item1"/>
                        <label htmlFor="checkbox" className="text-sm text-muted-foreground"> Lorem Ipsum Dolor Yessir</label>
                    </div>
                </Card>
                </div>
            </ScrollArea>
        </div>
    )
}

export default ToDoList