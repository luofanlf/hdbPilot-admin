'use client'

import { useEffect, useState } from 'react'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { Review } from '@/types/review'
import { format } from 'date-fns'
import { Loader2 } from 'lucide-react'

const REVIEWS_PER_PAGE = 5

export default function ReviewPage() {
    const [reviews, setReviews] = useState<Review[]>([])
    const [selected, setSelected] = useState<Set<string>>(new Set())
    const [sortDesc, setSortDesc] = useState(true)
    const [loading, setLoading] = useState(false)
    const [errorMsg, setErrorMsg] = useState<string | null>(null)
    const [successMsg, setSuccessMsg] = useState<string | null>(null)
    const [showConfirm, setShowConfirm] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch('/api/comments')
                const data = await res.json()
                if (Array.isArray(data)) {
                    setReviews(data)
                } else {
                    setReviews([])
                    setErrorMsg('Failed to load reviews: data format error')
                }
            } catch (e) {
                setErrorMsg('Failed to load reviews: network error')
            }
        }
        void fetchData()
    }, [])

    const sortedReviews = Array.isArray(reviews)
        ? [...reviews].sort((a, b) =>
            sortDesc
                ? new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                : new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        )
        : []

    const totalPages = Math.ceil(sortedReviews.length / REVIEWS_PER_PAGE)
    const currentReviews = sortedReviews.slice(
        (currentPage - 1) * REVIEWS_PER_PAGE,
        currentPage * REVIEWS_PER_PAGE
    )

    const toggleSelect = (id: string) => {
        const newSet = new Set(selected)
        if (newSet.has(id)) {
            newSet.delete(id)
        } else {
            newSet.add(id)
        }
        setSelected(newSet)
    }

    const toggleSelectAll = () => {
        const idsOnCurrentPage = currentReviews.map(r => r.id)
        const isAllSelected = idsOnCurrentPage.every(id => selected.has(id))

        if (isAllSelected) {
            const newSet = new Set(selected)
            idsOnCurrentPage.forEach(id => newSet.delete(id))
            setSelected(newSet)
        } else {
            const newSet = new Set(selected)
            idsOnCurrentPage.forEach(id => newSet.add(id))
            setSelected(newSet)
        }
    }

    const onDeleteClick = () => {
        setShowConfirm(true)
    }

    const confirmDelete = async () => {
        setShowConfirm(false)
        setLoading(true)
        setErrorMsg(null)
        setSuccessMsg(null)
        try {
            const res = await fetch('/api/comments/delete', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ids: Array.from(selected) }),
            })

            if (!res.ok) {
                throw new Error(`Delete failed with status code: ${res.status}`)
            }

            const remaining = reviews.filter(r => !selected.has(r.id))
            setReviews(remaining)
            setSelected(new Set())
            setSuccessMsg('Selected reviews deleted successfully')

            // Reset page if deleted all items on current page
            if ((currentPage - 1) * REVIEWS_PER_PAGE >= remaining.length && currentPage > 1) {
                setCurrentPage(currentPage - 1)
            }
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Unknown error'
            setErrorMsg(message)
        } finally {
            setLoading(false)
        }
    }

    const cancelDelete = () => {
        setShowConfirm(false)
    }

    const goToPrevPage = () => {
        setCurrentPage(prev => Math.max(1, prev - 1))
    }

    const goToNextPage = () => {
        setCurrentPage(prev => Math.min(totalPages, prev + 1))
    }

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold">User Reviews</h1>
                <div className="flex gap-2 items-center">
                    <Button variant="outline" onClick={() => setSortDesc(!sortDesc)}>
                        {sortDesc ? 'Sort Ascending' : 'Sort Descending'}
                    </Button>

                    {reviews.length > 0 && (
                        <Button variant="outline" onClick={toggleSelectAll}>
                            {currentReviews.every(r => selected.has(r.id))
                                ? 'Unselect All'
                                : 'Select All'}
                        </Button>
                    )}

                    {selected.size > 0 && (
                        <Button variant="destructive" onClick={onDeleteClick} disabled={loading}>
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Delete Selected ({selected.size})
                        </Button>
                    )}
                </div>
            </div>

            {errorMsg && <p className="text-sm text-red-500 mt-2">{errorMsg}</p>}
            {successMsg && <p className="text-sm text-green-500 mt-2">{successMsg}</p>}

            {currentReviews.length === 0 ? (
                <p className="text-muted-foreground">No reviews available</p>
            ) : (
                <div className="space-y-4">
                    {currentReviews.map((review) => (
                        <div
                            key={review.id}
                            className="flex items-start border rounded-lg p-4 gap-4 shadow-sm"
                        >
                            <Checkbox
                                checked={selected.has(review.id)}
                                onCheckedChange={() => toggleSelect(review.id)}
                            />
                            <div>
                                <div className="flex items-center gap-4">
                                    <p className="font-medium text-base">Property ID: {review.propertyId}</p>
                                    <p className="text-sm text-muted-foreground">
                                        {format(new Date(review.createdAt), 'yyyy-MM-dd HH:mm')}
                                    </p>
                                </div>
                                <p className="text-sm mt-2 text-muted-foreground">Rating: {review.rating} ⭐</p>
                                <p className="mt-2">{review.content}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="mt-6 flex justify-center gap-4 items-center">
                    <Button variant="outline" onClick={goToPrevPage} disabled={currentPage === 1}>
                        Previous
                    </Button>
                    <span className="text-sm text-muted-foreground">
                        Page {currentPage} of {totalPages}
                    </span>
                    <Button variant="outline" onClick={goToNextPage} disabled={currentPage === totalPages}>
                        Next
                    </Button>
                </div>
            )}

            {/* Delete confirmation modal */}
            {showConfirm && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full">
                        <h2 className="text-lg font-semibold mb-4">Confirm Deletion</h2>
                        <p>Are you sure you want to delete the selected reviews?</p>
                        <div className="mt-6 flex justify-end gap-4">
                            <Button variant="outline" onClick={cancelDelete} disabled={loading}>
                                Cancel
                            </Button>
                            <Button variant="destructive" onClick={confirmDelete} disabled={loading}>
                                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Confirm Delete
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
