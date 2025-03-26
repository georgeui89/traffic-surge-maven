
import * as React from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { useState } from "react"
import { Plus } from "lucide-react"

// Validation schema for campaign
const campaignSchema = z.object({
  name: z.string().min(3, { message: "Campaign name must be at least 3 characters" }),
  url: z.string().url({ message: "Please enter a valid URL" }),
  platform: z.string().min(1, { message: "Please select a platform" }),
  status: z.enum(["active", "paused"], { 
    required_error: "Please select a status" 
  }),
})

type CampaignFormValues = z.infer<typeof campaignSchema>

// Default values for form
const defaultValues: Partial<CampaignFormValues> = {
  name: "",
  url: "",
  platform: "",
  status: "active",
}

export function CampaignCreateDialog() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  
  const form = useForm<CampaignFormValues>({
    resolver: zodResolver(campaignSchema),
    defaultValues,
  })

  async function onSubmit(data: CampaignFormValues) {
    setLoading(true)
    try {
      // Simulate API request
      console.log("Creating campaign:", data)
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Show success message
      toast({
        title: "Campaign created",
        description: "Your campaign has been created successfully",
      })

      // Reset form and close dialog
      form.reset()
      setOpen(false)
    } catch (error) {
      console.error("Failed to create campaign:", error)
      toast({
        title: "Failed to create campaign",
        description: "Please try again later",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 w-full md:w-auto">
          <Plus className="h-4 w-4" />
          New Campaign
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Campaign</DialogTitle>
          <DialogDescription>
            Add a new traffic campaign to your account
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Campaign Name</FormLabel>
                  <FormControl>
                    <Input placeholder="My Awesome Campaign" {...field} />
                  </FormControl>
                  <FormDescription>
                    Enter a descriptive name for your campaign
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Target URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com" {...field} />
                  </FormControl>
                  <FormDescription>
                    The destination URL for your campaign
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="platform"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Platform</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select platform" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="9hits">9Hits</SelectItem>
                      <SelectItem value="hitleap">HitLeap</SelectItem>
                      <SelectItem value="otohits">Otohits</SelectItem>
                      <SelectItem value="easyHits4U">EasyHits4U</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Choose the traffic platform for this campaign
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="paused">Paused</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Set the initial status of your campaign
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="pt-4">
              <Button 
                variant="outline" 
                onClick={() => setOpen(false)} 
                type="button"
                disabled={loading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Creating...
                  </>
                ) : (
                  "Create Campaign"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
