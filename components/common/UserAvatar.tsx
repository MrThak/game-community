import { User } from 'lucide-react'

interface UserAvatarProps {
    avatarUrl?: string | null
    alt?: string
    name?: string
    size?: 'sm' | 'md' | 'lg'
    className?: string
}

export default function UserAvatar({ avatarUrl, alt = 'User', name, size = 'md', className = '' }: UserAvatarProps) {
    const sizeClasses = {
        sm: 'w-8 h-8',
        md: 'w-10 h-10',
        lg: 'w-12 h-12'
    }

    const iconSizes = {
        sm: 'w-4 h-4',
        md: 'w-5 h-5',
        lg: 'w-6 h-6'
    }

    return (
        <div className={`${sizeClasses[size]} rounded-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center overflow-hidden ${className}`}>
            {avatarUrl ? (
                <img
                    src={avatarUrl}
                    alt={alt}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                        // Fallback if image fails to load
                        e.currentTarget.style.display = 'none'
                        e.currentTarget.parentElement?.classList.add('fallback-icon')
                    }}
                />
            ) : (
                <User className={`${iconSizes[size]} text-gray-500 dark:text-gray-400`} />
            )}
        </div>
    )
}
