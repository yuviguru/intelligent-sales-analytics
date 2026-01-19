import { useState, useEffect, useRef } from 'react'
import { Notification } from '../components/NotificationsModal'

const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    type: 'insight',
    title: 'AI Model Performance Boost',
    message: 'GPT-4 Turbo achieved 23% faster response times this week. Your users are experiencing improved chat interactions.',
    time: '2 hours ago',
    read: false,
    details: {
      description: 'Our latest optimization algorithms have significantly reduced latency across all AI models. This improvement directly translates to better user experience and higher satisfaction rates.',
      metrics: [
        { label: 'Average Response Time', value: '1.2s', trend: 'up' },
        { label: 'User Satisfaction', value: '94%', trend: 'up' },
        { label: 'API Calls This Week', value: '45.2K', trend: 'up' },
      ],
      actions: [
        {
          label: 'View Performance Dashboard',
          description: 'See detailed analytics and performance trends over time'
        },
        {
          label: 'Configure Model Settings',
          description: 'Fine-tune model parameters for optimal performance'
        },
      ],
    },
  },
  {
    id: '2',
    type: 'success',
    title: 'Revenue Milestone Reached',
    message: 'Congratulations! Your dashboard has processed over $45,000 in AI-powered transactions this month.',
    time: '5 hours ago',
    read: false,
    details: {
      description: 'Your revenue has grown 34% compared to last month. The majority of growth came from increased usage of premium AI features and new customer acquisitions.',
      metrics: [
        { label: 'Monthly Revenue', value: '$45,234', trend: 'up' },
        { label: 'Growth Rate', value: '+34%', trend: 'up' },
        { label: 'Active Users', value: '1,247', trend: 'up' },
      ],
      actions: [
        {
          label: 'View Revenue Analytics',
          description: 'Analyze revenue breakdown by feature and customer segment'
        },
        {
          label: 'Export Financial Report',
          description: 'Generate detailed monthly financial statement'
        },
      ],
    },
  },
  {
    id: '3',
    type: 'warning',
    title: 'API Rate Limit Alert',
    message: 'You\'ve used 85% of your monthly Claude API quota. Consider upgrading to avoid service interruptions.',
    time: '1 day ago',
    read: false,
    details: {
      description: 'Based on current usage patterns, you\'re projected to exceed your quota in 4 days. Upgrading to the next tier will provide 3x more capacity and unlock advanced features.',
      metrics: [
        { label: 'Quota Used', value: '85%', trend: 'down' },
        { label: 'Days Remaining', value: '4 days' },
        { label: 'Average Daily Usage', value: '12.5K calls' },
      ],
      actions: [
        {
          label: 'Upgrade Plan',
          description: 'Increase your quota and unlock premium features'
        },
        {
          label: 'Optimize API Usage',
          description: 'Learn how to reduce unnecessary API calls'
        },
      ],
    },
  },
  {
    id: '4',
    type: 'info',
    title: 'New AI Feature Available',
    message: 'Gemini Pro 1.5 with extended context window is now available. Perfect for analyzing longer documents and conversations.',
    time: '2 days ago',
    read: true,
    details: {
      description: 'The new Gemini Pro 1.5 model supports up to 1M tokens of context, enabling analysis of entire codebases, long documents, and extended conversations without losing context.',
      actions: [
        {
          label: 'Try Gemini Pro 1.5',
          description: 'Start using the new model in your applications'
        },
        {
          label: 'Read Documentation',
          description: 'Learn about capabilities and best practices'
        },
      ],
    },
  },
  {
    id: '5',
    type: 'insight',
    title: 'Customer Behavior Insight',
    message: 'AI analysis shows 67% of your customers prefer streaming responses. Consider optimizing for real-time interactions.',
    time: '3 days ago',
    read: true,
    details: {
      description: 'Our behavioral analysis reveals that users engage more when they can see responses being generated in real-time. Streaming responses reduce perceived wait time and increase user satisfaction.',
      metrics: [
        { label: 'Streaming Preference', value: '67%' },
        { label: 'Avg. Session Duration', value: '8.5 min', trend: 'up' },
        { label: 'User Engagement', value: '+42%', trend: 'up' },
      ],
    },
  },
  {
    id: '6',
    type: 'success',
    title: 'Model Fine-tuning Complete',
    message: 'Your custom GPT model training has completed successfully. Accuracy improved by 15% on domain-specific tasks.',
    time: '4 days ago',
    read: true,
    details: {
      description: 'The fine-tuned model has been trained on your domain-specific data and is now ready for deployment. It shows significant improvements in accuracy and relevance for your use case.',
      metrics: [
        { label: 'Accuracy Improvement', value: '+15%', trend: 'up' },
        { label: 'Training Examples', value: '10,000' },
        { label: 'Model Version', value: 'v2.1' },
      ],
      actions: [
        {
          label: 'Deploy Model',
          description: 'Replace current model with the fine-tuned version'
        },
        {
          label: 'Test Performance',
          description: 'Run benchmarks to validate improvements'
        },
      ],
    },
  },
]

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const unreadCount = notifications.filter(n => !n.read).length

  // Method to add a new notification from real-time events
  const addNotification = (notification: Notification) => {
    setNotifications(prev => [notification, ...prev].slice(0, 20)) // Keep only 20 most recent
  }

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isDropdownOpen])

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (selectedNotification) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [selectedNotification])

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id
          ? { ...notification, read: true }
          : notification
      )
    )
  }

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    )
  }

  const toggleDropdown = () => {
    setIsDropdownOpen(prev => !prev)
  }

  const closeDropdown = () => {
    setIsDropdownOpen(false)
  }

  const openNotificationModal = (notification: Notification) => {
    setSelectedNotification(notification)
    markAsRead(notification.id)
    closeDropdown()
  }

  const closeNotificationModal = () => {
    setSelectedNotification(null)
  }

  return {
    notifications,
    isDropdownOpen,
    selectedNotification,
    unreadCount,
    dropdownRef,
    markAsRead,
    markAllAsRead,
    toggleDropdown,
    closeDropdown,
    openNotificationModal,
    closeNotificationModal,
    addNotification,
  }
}
