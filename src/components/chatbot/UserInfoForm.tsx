import { useState, FormEvent } from 'react'

interface UserInfoFormProps {
  onSubmit: (data: { name: string; email: string; mobile: string }) => void
  initialData?: {
    name?: string
    email?: string
    mobile?: string
  }
}

const UserInfoForm: React.FC<UserInfoFormProps> = ({ onSubmit, initialData }) => {
  const [name, setName] = useState(initialData?.name || '')
  const [email, setEmail] = useState(initialData?.email || '')
  const [mobile, setMobile] = useState(initialData?.mobile || '')
  const [errors, setErrors] = useState<{ name?: string; email?: string; mobile?: string }>({})

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(email)
  }

  const validateMobile = (mobile: string) => {
    const re = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/
    return re.test(mobile.replace(/\s/g, ''))
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const newErrors: { name?: string; email?: string; mobile?: string } = {}

    if (!name.trim()) {
      newErrors.name = 'Name is required'
    }

    if (!email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    if (!mobile.trim()) {
      newErrors.mobile = 'Mobile number is required'
    } else if (!validateMobile(mobile)) {
      newErrors.mobile = 'Please enter a valid mobile number'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    onSubmit({ name: name.trim(), email: email.trim().toLowerCase(), mobile: mobile.trim() })
  }

  return (
    <div className="p-4 border-b border-gray-200 bg-gradient-to-br from-blue-50 to-indigo-50">
      <h3 className="text-sm font-semibold text-gray-800 mb-3">Please provide your contact information</h3>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label htmlFor="name" className="block text-xs font-medium text-gray-700 mb-1">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => {
              setName(e.target.value)
              if (errors.name) setErrors({ ...errors, name: undefined })
            }}
            className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.name ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="Enter your full name"
          />
          {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
        </div>

        <div>
          <label htmlFor="email" className="block text-xs font-medium text-gray-700 mb-1">
            Email Address <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              if (errors.email) setErrors({ ...errors, email: undefined })
            }}
            className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.email ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="your.email@example.com"
          />
          {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
        </div>

        <div>
          <label htmlFor="mobile" className="block text-xs font-medium text-gray-700 mb-1">
            Mobile Number <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            id="mobile"
            value={mobile}
            onChange={(e) => {
              setMobile(e.target.value)
              if (errors.mobile) setErrors({ ...errors, mobile: undefined })
            }}
            className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.mobile ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="+1 234 567 8900"
          />
          {errors.mobile && <p className="text-xs text-red-500 mt-1">{errors.mobile}</p>}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2 px-4 rounded-lg transition-colors shadow-sm hover:shadow-md"
        >
          Continue to Chat
        </button>
      </form>
      <p className="text-xs text-gray-500 mt-2 text-center">
        We'll use this information to contact you about your patent inquiry
      </p>
    </div>
  )
}

export default UserInfoForm

