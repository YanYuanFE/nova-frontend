"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useState } from "react"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { createProject } from "@/services/project"
import { toast } from "@/components/ui/use-toast"

type TOptions = "react" | "node" | "cairo" | "python" | "more"

const data: {
  id: TOptions
  name: string
  icon: string
  description: string
  disabled: boolean
}[] = [
    {
      id: "cairo",
      name: "Cairo",
      icon: "/icons/cairo.png",
      description: "cairo project",
      disabled: false,
    },
  ]

const formSchema = z.object({
  name: z
    .string()
    .min(1)
    .max(16)
    .refine(
      (value) => /^[a-zA-Z0-9_]+$/.test(value),
      "Name must be alphanumeric and can contain underscores"
    ),
  visibility: z.enum(["public", "private"]),
})

export function NewProjectModal() {
  const [selected, setSelected] = useState<TOptions>("cairo")
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      visibility: "public",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {

    const data = { type: selected, ...values }
    setLoading(true)

    const id = await createProject(data);
    setLoading(false)
    console.log(id)
    toast({
      variant: "default",
      title: "Project created",
      description: "Your project has been created",
    })
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(open: boolean) => {
        if (!loading) setOpen(open)
      }}
    >
        <DialogTrigger asChild>
        <Button variant="outline">Create Project</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Cairo Project</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 w-full gap-2 mt-2">
          {data.map((item) => (
            <button
              disabled={item.disabled || loading}
              key={item.id}
              onClick={() => setSelected(item.id)}
              className={`${selected === item.id ? "border-foreground" : "border-border"
                } rounded-md border bg-card text-card-foreground shadow text-left p-4 flex flex-col transition-all focus-visible:outline-none focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <div className="space-x-2 flex items-center justify-start w-full">
                <img alt="" src={item.icon} width={20} height={20} />
                <div className="font-medium">{item.name}</div>
              </div>
              <div className="mt-2 text-muted-foreground text-sm">
                {item.description}
              </div>
            </button>
          ))}
        </div>

        <Form {...form}>
          <form autoComplete="off" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="mb-4">
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="My Project"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="visibility"
              render={({ field }) => (
                <FormItem className="mb-8">
                  <FormLabel>Visibility</FormLabel>
                  <Select
                    disabled={loading}
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="public">Public</SelectItem>
                      <SelectItem value="private">Private</SelectItem>
                    </SelectContent>
                  </Select>
                  {/* <FormDescription>
                    Note: All sandboxes cannot be seen by the public. Private
                    sandboxes cannot be accessed by shared users that you add,
                    while public sandboxes can.
                  </FormDescription> */}
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button disabled={loading} type="submit" className="w-full">
              {loading ? (
                <>
                  <Loader2 className="animate-spin mr-2 h-4 w-4" /> Creating
                  project...
                </>
              ) : (
                "Submit"
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
