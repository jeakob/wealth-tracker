import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

export function DatePicker({ value, onChange, className, placeholder = "Pick a date" }) {
    // Convert string YYYY-MM-DD to Date object for Calendar
    // Note: 'value' should be YYYY-MM-DD string or undefined/null
    const dateValue = value ? new Date(value) : undefined;

    const handleSelect = (newDate) => {
        if (newDate) {
            // Format to YYYY-MM-DD to store in state/backend (which expects ISO-like usually)
            // using date-fns format
            // Note: date-fns 'format' returns local time string which is what we want for date picker usually 
            // (avoid timezone shifts for simple dates if possible, or just use YYYY-MM-DD)
            const dateString = format(newDate, "yyyy-MM-dd");
            onChange(dateString);
        } else {
            onChange('');
        }
    };

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant={"outline"}
                    className={cn(
                        "w-[280px] justify-start text-left font-normal",
                        !value && "text-muted-foreground",
                        className
                    )}
                >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {value ? format(dateValue, "dd/MM/yy") : <span>{placeholder}</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
                <Calendar
                    mode="single"
                    selected={dateValue}
                    onSelect={handleSelect}
                    initialFocus
                />
            </PopoverContent>
        </Popover>
    )
}
