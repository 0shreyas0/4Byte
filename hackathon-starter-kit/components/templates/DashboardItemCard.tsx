"use client";

import { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";

interface DashboardItemCardProps {
    status?: ReactNode;
    media?: ReactNode;
    title?: string | ReactNode;
    type?: ReactNode;
    description?: string | ReactNode;
    actions?: ReactNode;
    className?: string;
}

export default function DashboardItemCard({ 
    status, 
    media, 
    title, 
    type, 
    description, 
    actions,
    className = "" 
}: DashboardItemCardProps) {
    return (
        <Card className={`overflow-hidden hover:shadow-lg transition-shadow relative group h-full flex flex-col ${className}`}>
            {/* Slot: Status */}
            {status && (
                <div className="absolute top-2 right-2 z-10">
                    {status}
                </div>
            )}

            {/* Slot: Media */}
            <div className="aspect-video w-full bg-secondary relative overflow-hidden">
                {media || (
                    <div className="flex h-full w-full items-center justify-center bg-secondary text-muted-foreground">
                        No Media
                    </div>
                )}
            </div>

            <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                    <CardTitle className="text-h3 font-heading truncate pr-12">
                        {typeof title === 'string' ? title : title}
                    </CardTitle>
                    {type}
                </div>
            </CardHeader>

            <CardContent className="flex-1 flex flex-col">
                <div className="space-y-4 text-sm text-muted-foreground flex-1 flex flex-col">
                    <div className="flex-1">
                        {typeof description === 'string' ? (
                            <p className="line-clamp-2">{description}</p>
                        ) : (
                            description
                        )}
                    </div>

                    {/* Slot: Actions */}
                    {actions && (
                        <div className="pt-4 flex items-center mt-auto gap-2">
                            {actions}
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
