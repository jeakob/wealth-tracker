import React, { useState } from 'react';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePicker } from "@/components/ui/custom-date-picker";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Edit2, Trash2, ChevronLeft, ChevronRight, Save, X } from "lucide-react";
import { getAssetIcon } from "@/lib/assetIcons";

const ITEMS_PER_PAGE = 10; // Increased for manage page

const AssetTable = ({ assets, onEdit, onDelete, isManagePage = false }) => {
    const [filterType, setFilterType] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [dateFilter, setDateFilter] = useState({ start: '', end: '' });

    // Inline Editing State
    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState({});

    const handleStartEdit = (asset) => {
        if (!isManagePage) {
            onEdit(asset); // Fallback to old behavior (likely modal or redirect if not management page)
            return;
        }
        setEditingId(asset.id);
        setEditForm({ ...asset });
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setEditForm({});
    };

    const handleSaveEdit = () => {
        onEdit(editForm); // This calls handleUpdateAsset in App
        setEditingId(null);
    };

    const handleEditChange = (field, value) => {
        setEditForm(prev => ({ ...prev, [field]: value }));
    };

    const filteredAssets = assets.filter(asset => {
        const matchesType = filterType === 'all' || asset.type === filterType;
        const matchesDate = (!dateFilter.start || new Date(asset.date) >= new Date(dateFilter.start)) &&
            (!dateFilter.end || new Date(asset.date) <= new Date(dateFilter.end));
        return matchesType && matchesDate;
    });

    const totalPages = Math.ceil(filteredAssets.length / ITEMS_PER_PAGE);
    const displayedAssets = filteredAssets.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    return (
        <Card className="border-none shadow-md">
            <CardHeader>
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <CardTitle>Asset List</CardTitle>
                    <div className="flex flex-wrap gap-2 items-center">
                        <Select value={filterType} onValueChange={setFilterType}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Filter Type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Types</SelectItem>
                                <SelectItem value="Property / Real Estate">Property / Real Estate</SelectItem>
                                <SelectItem value="Pension Fund">Pension Fund</SelectItem>
                                <SelectItem value="Savings Account">Savings Account</SelectItem>
                                <SelectItem value="Bonds Portfolio">Bonds Portfolio</SelectItem>
                                <SelectItem value="Stocks/Shares Portfolio">Stocks/Shares Portfolio</SelectItem>
                                <SelectItem value="ISA (Individual Savings Account)">ISA (Individual Savings Account)</SelectItem>
                                <SelectItem value="Cryptocurrency">Cryptocurrency</SelectItem>
                                <SelectItem value="Private Business Equity">Private Business Equity</SelectItem>
                                <SelectItem value="Gold/Precious Metals">Gold/Precious Metals</SelectItem>
                                <SelectItem value="Miscellaneous (Antiques, Jewelry, etc.)">Miscellaneous</SelectItem>
                            </SelectContent>
                        </Select>
                        <DatePicker
                            value={dateFilter.start}
                            onChange={(val) => setDateFilter(prev => ({ ...prev, start: val }))}
                            className="w-[150px]"
                            placeholder="Start Date"
                        />
                        <span className="text-muted-foreground">-</span>
                        <DatePicker
                            value={dateFilter.end}
                            onChange={(val) => setDateFilter(prev => ({ ...prev, end: val }))}
                            className="w-[150px]"
                            placeholder="End Date"
                        />
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[200px]">Name</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Value</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {displayedAssets.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                                        No assets found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                displayedAssets.map((asset) => (
                                    <TableRow key={asset.id} className={editingId === asset.id ? "bg-muted/50" : ""}>
                                        {/* Name Cell */}
                                        <TableCell className="font-medium">
                                            {editingId === asset.id ? (
                                                <Input
                                                    value={editForm.name}
                                                    onChange={(e) => handleEditChange('name', e.target.value)}
                                                />
                                            ) : (
                                                asset.name
                                            )}
                                        </TableCell>

                                        {/* Type Cell */}
                                        <TableCell>
                                            <div className="capitalize flex items-center gap-2">
                                                {getAssetIcon(asset.type)}
                                                <span>{asset.type === 'bank' ? 'Bank Account' : asset.type}</span>
                                            </div>
                                        </TableCell>

                                        {/* Value Cell */}
                                        <TableCell>
                                            {editingId === asset.id ? (
                                                <div className="flex items-center gap-2">
                                                    <Input
                                                        type="number"
                                                        value={editForm.value}
                                                        onChange={(e) => handleEditChange('value', e.target.value)}
                                                        className="w-[100px]"
                                                    />
                                                    <span className="text-sm text-muted-foreground">{asset.currency}</span>
                                                </div>
                                            ) : (
                                                `${asset.value} ${asset.currency}`
                                            )}
                                        </TableCell>

                                        {/* Date Cell */}
                                        <TableCell>
                                            {editingId === asset.id ? (
                                                <DatePicker
                                                    value={editForm.date}
                                                    onChange={(val) => handleEditChange('date', val)}
                                                    className="w-[140px]"
                                                />
                                            ) : (
                                                new Date(asset.date).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: '2-digit' })
                                            )}
                                        </TableCell>

                                        {/* Actions */}
                                        <TableCell className="text-right">
                                            {editingId === asset.id ? (
                                                <div className="flex justify-end gap-2">
                                                    <Button variant="ghost" size="icon" className="text-green-500 hover:text-green-600" onClick={handleSaveEdit}>
                                                        <Save className="h-4 w-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" className="text-muted-foreground" onClick={handleCancelEdit}>
                                                        <X className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            ) : (
                                                <div className="flex justify-end gap-2">
                                                    <Button variant="ghost" size="icon" onClick={() => handleStartEdit(asset)}>
                                                        <Edit2 className="h-4 w-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => onDelete(asset.id)}>
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>

                {totalPages > 1 && (
                    <div className="flex items-center justify-end space-x-2 py-4">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                        >
                            <ChevronLeft className="h-4 w-4" />
                            Previous
                        </Button>
                        <span className="text-sm text-muted-foreground">Page {currentPage} of {totalPages}</span>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                        >
                            Next
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default AssetTable;
