import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from "@radix-ui/react-dialog";
import { cn } from "./cn";
import { sendFeedback } from "./send";

export type FeedbackWidgetProps = {
  children: React.ReactNode;
};

export function FeedbackWidget({ children }: FeedbackWidgetProps) {
  const [open, setOpen] = React.useState(false);
  const [feedback, setFeedback] = React.useState("");
  const [sending, setSending] = React.useState(false);

  async function handleCancel() {
    setOpen(false);
    setFeedback("");
    setSending(false);
  }

  async function handleSend() {
    // todo validate

    setSending(true);

    await sendFeedback(feedback.trim());

    handleCancel();
  }

  async function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && e.metaKey) {
      e.preventDefault();
      await handleSend();
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogPortal>
        <DialogOverlay
          data-html2canvas-ignore
          className={cn(
            "tw:z-40 tw:bg-black/15 tw:fixed tw:inset-0",
            "tw:data-[state=open]:fade-in tw:data-[state=open]:animate-in",
            "tw:data-[state=closed]:fade-out tw:data-[state=closed]:animate-out"
          )}
        />
        <DialogContent
          data-html2canvas-ignore
          className={cn(
            "tw:bg-white tw:rounded-xl tw:shadow-xs tw:p-3 tw:fixed tw:bottom-10 tw:left-1/2 tw:-translate-x-1/2 tw:z-50 tw:w-lg tw:flex tw:flex-col tw:gap-2",
            "tw:data-[state=open]:animate-in tw:data-[state=open]:slide-in-from-bottom tw:fade-in",
            "tw:data-[state=closed]:fade-out tw:data-[state=closed]:slide-out-to-bottom tw:data-[state=closed]:animate-out"
          )}
        >
          <DialogTitle className="tw:sr-only">Give Feedback</DialogTitle>
          <DialogDescription className="tw:sr-only">
            Enter any suggestions, feedback or issues below.
          </DialogDescription>

          <textarea
            autoFocus
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            disabled={sending}
            className="tw:focus:outline-none tw:w-full tw:h-[100px] tw:resize-none tw:border tw:border-stone-300 tw:rounded-lg tw:focus:ring-2 tw:focus:ring-stone-500 tw:focus:border-transparent tw:p-3 tw:text-sm"
            placeholder="Enter your feedback here"
            onKeyDown={handleKeyDown}
          />
          <div className="tw:flex tw:items-stretch tw:gap-2">
            <button
              disabled={sending}
              onClick={handleCancel}
              className="tw:justify-center tw:h-8 tw:flex tw:items-center tw:gap-2 tw:rounded-lg tw:transition-colors tw:bg-stone-100 tw:hover:bg-stone-200 tw:text-sm tw:font-medium tw:flex-1"
            >
              <span>Cancel</span>
            </button>
            <button
              onClick={handleSend}
              disabled={sending || !feedback.trim()}
              className="tw:justify-center tw:h-8 tw:flex tw:items-center tw:gap-2 tw:rounded-lg tw:transition-colors tw:bg-stone-900 tw:hover:bg-stone-800 tw:text-white tw:text-sm tw:font-medium tw:flex-1"
            >
              <span>Send</span>
            </button>
          </div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}
