'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { Loader2, Flame, Heart, CheckCircle2, ChevronRight, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

function BookingForm() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pujaId = searchParams.get('pujaId')

  const [puja, setPuja] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [booking, setBooking] = useState(false)
  const [successBooking, setSuccessBooking] = useState<any>(null)

  // Form states
  const [devoteeName, setDevoteeName] = useState('')
  const [fatherHusbandName, setFatherHusbandName] = useState('')
  const [gotra, setGotra] = useState('Kashyap')
  const [description, setDescription] = useState('')

  useEffect(() => {
    if (!pujaId) {
      toast.error('Puja selection is required')
      setLoading(false)
      return
    }

    fetch(`/api/bookings?pujaId=${pujaId}`)
      .then((r) => r.json())
      .then((j) => {
        if (j.ok) {
          setPuja(j.data)
        } else {
          toast.error(j.error || 'Failed to fetch puja details')
        }
      })
      .catch(() => toast.error('Error loading puja'))
      .finally(() => setLoading(false))
  }, [pujaId])

  async function handleBook(e: React.FormEvent) {
    e.preventDefault()
    if (!puja) return

    setBooking(true)
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pujaId: puja.id,
          devoteeName,
          fatherHusbandName,
          gotra,
          description,
        }),
      })
      const data = await res.json()
      if (data.ok) {
        setSuccessBooking(data.data)
        toast.success('Sankalp details registered successfully!')
      } else {
        toast.error(data.error || 'Failed to register booking')
      }
    } catch {
      toast.error('Network error during booking')
    } finally {
      setBooking(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!puja && !successBooking) {
    return (
      <div className="text-center py-10">
        <h2 className="text-xl font-bold text-destructive">Puja details not found or loading failed.</h2>
        <Button className="mt-4" asChild>
          <Link href="/">Return Home</Link>
        </Button>
      </div>
    )
  }

  if (successBooking) {
    return (
      <div className="max-w-xl mx-auto py-12 px-4">
        <Card className="border-2 border-green-200 bg-green-50/30">
          <CardContent className="p-8 text-center space-y-6">
            <div className="mx-auto h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle2 className="h-10 w-10 text-green-600" />
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-green-800">Sankalp Registered!</h1>
              <p className="text-muted-foreground text-sm">
                Thank you for booking. Your sankalp patra details have been recorded.
              </p>
            </div>

            <div className="p-4 bg-white rounded-lg border text-left space-y-2 text-sm">
              <div className="flex justify-between border-b pb-1.5 font-semibold text-slate-700">
                <span>Booking Reference:</span>
                <span className="font-mono text-primary">{successBooking.bookingNumber}</span>
              </div>
              <div className="flex justify-between py-1">
                <span>Puja:</span>
                <span className="font-medium text-slate-800">{puja?.title || 'Sacred Ritual'}</span>
              </div>
              <div className="flex justify-between py-1">
                <span>Devotee:</span>
                <span className="font-medium text-slate-800">{devoteeName}</span>
              </div>
              <div className="flex justify-between py-1">
                <span>Gotra:</span>
                <span className="font-medium text-slate-800">{gotra}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <Button asChild className="w-full sm:w-auto">
                <Link href="/dashboard/bookings">View My Bookings</Link>
              </Button>
              <Button asChild variant="outline" className="w-full sm:w-auto">
                <Link href="/">Back to Home</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 grid gap-8 md:grid-cols-5">
      <div className="md:col-span-2 space-y-4">
        <Button variant="ghost" size="sm" className="gap-1.5" asChild>
          <Link href="/"><ArrowLeft className="h-4 w-4" /> Back</Link>
        </Button>
        <Card className="overflow-hidden border-2 border-primary/10">
          <div className="aspect-[4/3] w-full bg-slate-100 overflow-hidden relative">
            {puja.coverImage ? (
              <img src={puja.coverImage} alt={puja.title} className="h-full w-full object-cover" />
            ) : (
              <div className="h-full w-full flex items-center justify-center bg-orange-50 text-primary">
                <Flame className="h-16 w-16 animate-pulse" />
              </div>
            )}
          </div>
          <CardContent className="p-5 space-y-3">
            <h2 className="text-xl font-bold">{puja.title}</h2>
            {puja.temple && (
              <p className="text-xs text-muted-foreground">
                📍 {puja.temple.name}, {puja.temple.city}
              </p>
            )}
            <div className="flex justify-between items-center pt-2 border-t text-sm font-semibold">
              <span>Ritual Offering Price:</span>
              <span className="text-lg text-primary">₹{Number(puja.price)}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="md:col-span-3">
        <Card className="border-2 border-primary/20 shadow-lg">
          <CardHeader className="bg-primary/5 border-b">
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <Heart className="h-5 w-5 text-primary fill-primary" /> Sankalp Patra (संकल्प पत्र)
            </CardTitle>
            <CardDescription>
              Please fill in your authentic lineage and family details for the pandit to chant during the ritual invocation.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleBook} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="dName">Devotee Full Name *</Label>
                <Input
                  id="dName"
                  placeholder="e.g. Ramesh Bohra"
                  value={devoteeName}
                  onChange={(e) => setDevoteeName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fName">Father / Husband Name *</Label>
                <Input
                  id="fName"
                  placeholder="e.g. Suresh Bohra"
                  value={fatherHusbandName}
                  onChange={(e) => setFatherHusbandName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="gotraInput">Gotra (गोत्र) *</Label>
                <Input
                  id="gotraInput"
                  placeholder="Kashyap"
                  value={gotra}
                  onChange={(e) => setGotra(e.target.value)}
                  required
                />
                <p className="text-[10px] text-muted-foreground">Default is Kashyap. Change if you know your family gotra.</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="pDesc">Puja Purpose / Sankalp Description *</Label>
                <Textarea
                  id="pDesc"
                  placeholder="Describe your prayers (e.g., family health, business success, peace & prosperity)"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  rows={4}
                />
              </div>

              <Button type="submit" disabled={booking} className="w-full py-6 text-base font-bold bg-primary hover:bg-primary/90">
                {booking ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Registering Sankalp…
                  </>
                ) : (
                  <>
                    Confirm & Proceed to Booking <ChevronRight className="ml-1 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function NewBookingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    }>
      <BookingForm />
    </Suspense>
  )
}
