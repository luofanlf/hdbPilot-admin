export interface Review {
    id: string                // Comment.id
    rating: number            // Comment.rating
    content: string           // Comment.content
    createdAt: string         // Comment.createdAt（ISO 字符串）
    propertyId: string        // Comment.propertyId
    userId: string            // Comment.userId
}
