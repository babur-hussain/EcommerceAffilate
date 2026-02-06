export default function Header() {
    return (
        <div className="border-b h-16 flex items-center px-6 bg-white dark:bg-zinc-950">
            <div className="ml-auto flex items-center gap-x-4">
                <div className="flex items-center gap-x-2 text-sm">
                    <span className="font-medium text-zinc-700 dark:text-zinc-200">Admin User</span>
                    <div className="h-8 w-8 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center">
                        A
                    </div>
                </div>
            </div>
        </div>
    )
}
