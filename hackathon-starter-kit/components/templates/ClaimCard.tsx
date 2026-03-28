"use client";

import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import { Button } from "../ui/Button";
import { Trash } from 'lucide-react';
import Link from "next/link";

interface ClaimRecord {
    _id: string;
    status: 'pending' | 'approved' | 'rejected';
    message: string;
    item?: {
        _id: string;
        title: string;
        type: string;
        images?: string[];
    };
}

interface ClaimCardProps {
    claim: ClaimRecord;
    onEdit?: (claim: ClaimRecord) => void;
    onDelete?: (id: string) => void;
}

export default function ClaimCard({ claim, onEdit, onDelete }: ClaimCardProps) {
    return (
        <Card className="overflow-hidden hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-xs font-action uppercase tracking-action mb-1 text-muted-foreground">
                            {claim.item?.type === 'lost' ? 'Retrieval for' : 'Claim for'}
                        </p>
                        <CardTitle className="text-h3 font-heading tracking-heading leading-heading truncate">{claim.item?.title || 'Unknown Item'}</CardTitle>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-action tracking-action uppercase border ${
                        claim.status === 'approved'
                            ? 'bg-success/10 text-success border-success/20'
                            : claim.status === 'rejected'
                                ? 'bg-destructive/10 text-destructive border-destructive/20'
                                : 'bg-warning/10 text-warning border-warning/20'
                    }`}>
                        {claim.status}
                    </span>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {claim.item?.images?.[0] && (
                        <div className="aspect-square w-full bg-secondary rounded-md overflow-hidden">
                            <img src={claim.item.images[0]} alt="Item" className="w-full h-full object-cover opacity-80" />
                        </div>
                    )}

                    <div className="text-sm font-body tracking-body leading-body bg-accent p-3 rounded text-muted-foreground italic">
                        "{claim.message}"
                    </div>

                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1">
                            View Details
                        </Button>
                        {claim.status === 'pending' && (
                            <>
                                {onEdit && (
                                    <Button variant="secondary" size="sm" onClick={() => onEdit(claim)}>
                                        Edit
                                    </Button>
                                )}
                                {onDelete && (
                                    <Button variant="danger" size="sm" onClick={() => onDelete(claim._id)}>
                                        <Trash className="w-4 h-4" />
                                    </Button>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
