"use client";
import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

function Tabs({ className, ...props }) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      className={cn("flex flex-col gap-2", className)}
      {...props}
    />
  );
}

function TabsList({ className, ...props }) {
  // State to track underline position
  const [underlineStyle, setUnderlineStyle] = React.useState({
    left: 0,
    width: 0,
  });
  const ref = React.useRef(null);

  // On active tab change, update the underline position
  // We listen for active tab change by tracking the current value of TabsPrimitive.Root context by a custom event
  React.useEffect(() => {
    function updateUnderline() {
      if (!ref.current) return;
      const activeTrigger = ref.current.querySelector('[data-state="active"]');
      if (activeTrigger) {
        setUnderlineStyle({
          left: activeTrigger.offsetLeft,
          width: activeTrigger.offsetWidth,
        });
      }
    }
    updateUnderline();

    // In case active tab changes later
    // We listen for mutations inside this container for state changes
    const observer = new MutationObserver(updateUnderline);
    if (ref.current)
      observer.observe(ref.current, {
        attributes: true,
        subtree: true,
        attributeFilter: ["data-state"],
      });

    window.addEventListener("resize", updateUnderline);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateUnderline);
    };
  }, []);

  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      ref={ref}
      className={cn(
        "relative inline-flex h-9 w-fit items-center justify-center rounded-lg p-[3px]",
        className,
      )}
      {...props}
    >
      {props.children}
      {/* Animated underline */}
      <motion.div
        layout
        initial={false}
        animate={{ left: underlineStyle.left, width: underlineStyle.width }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className="absolute bottom-0 h-[2px] bg-blue-500 rounded"
        style={{ position: "absolute" }}
      />
    </TabsPrimitive.List>
  );
}

function TabsTrigger({ className, ...props }) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring text-foreground dark:text-muted-foreground inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap transition-colors disabled:pointer-events-none disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}

function TabsContent({ className, ...props }) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn("flex-1 outline-none", className)}
      {...props}
    />
  );
}

export { Tabs, TabsList, TabsTrigger, TabsContent };
