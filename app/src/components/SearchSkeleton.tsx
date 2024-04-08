import { Skeleton } from "./ui/skeleton";

export default function SearchSkeleton() {
    return (
        <>
            {["sa-1", "sa-2", "sa-3"].map((s) => (
                <div className="flex items-center space-x-4 m-8" key={s}>
                    <Skeleton className="h-24 w-24 rounded-full" />
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-[140px]" />
                        <Skeleton className="h-4 w-[100px]" />
                    </div>
                </div>
            ))}
            {["s-1", "s-2", "s-3", "s-4", "s-5", "s-6"].map((s) => (
                <div className="flex flex-col space-y-3 m-8" key={s}>
                    <Skeleton className="h-[125px] w-[250px] rounded-xl" />
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-[250px]" />
                        <Skeleton className="h-4 w-[200px]" />
                    </div>
                </div>
            ))}
        </>
    );
}
