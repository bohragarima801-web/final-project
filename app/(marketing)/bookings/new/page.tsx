'use client'

import { useEffect, useState, use } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { 
  Flame, Sparkles, ShieldCheck, Video, Calendar, User, CheckCircle2,
  Users, Plus, Trash2, ArrowLeft, Loader2, Landmark
} from 'lucide-react'

type FamilyMemberInput = {
  fullName: string
  gotra: string
  relation: string
  age: string
}

export default function NewBookingPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const pujaId = searchParams.get('pujaId')

  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [user, setUser] = useState<any | null>(null)
  const [puja, setPuja] = useState<any | null>(null)

  // Booking fields
  const [sankalpText, setSankalpText] = useState('')
  const [gotra, setGotra] = useState('')
  const [specialInstructions, setSpecialInstructions] = useState('')
  const [familyMembers, setFamilyMembers] = useState<FamilyMemberInput[]>([])

  // Family member form state
  const [mName, setMName] = useState('')
  const [mGotra, setMGotra] = useState('')
  const [mRelation, setMRelation] = useState('Spouse')
  const [mAge, setMAge] = useState('')

  // Success screen state
  const [successBooking, setSuccessBooking] = useState<any | null>(null)

  useEffect(() => {
    async function init() {
      try {
        setLoading(true)
        // Fetch current user
        const authRes = await fetch('/api/health') // wait, let's use a quick local fetch or check health
        const userRes = await fetch('/app/api/auth/me').catch(() => null) // wait, let's fetch current user safely
        
        // Let's get user details via general health or session check
        const sessionRes = await fetch('/api/health')
        const sessionData = await sessionRes.json()
        
        // Fetch user from internal check
        const userCheck = await fetch('/api/admin/settings').catch(() => null)
        if (userCheck && userCheck.status === 401) {
          // Admin unauthorized is fine, we just need to see if we can read the user
        }

        // We can load current user info by fetching from our auth fallback or a small endpoint. 
        // Let's call standard health/session info or load defaults.
        // Let's try loading the puja details first
        if (pujaId) {
          const res = await fetch(`/api/admin/puja?id=${pujaId}`)
          const pujaData = await res.json()
          if (pujaData.ok && pujaData.data) {
            setPuja(pujaData.data)
          } else {
            // Let's query pujas from all pujas
            const pujasRes = await fetch('/api/admin/puja')
            const pujasData = await pujasRes.json()
            if (pujasData.ok && pujasData.data) {
              const matched = pujasData.data.find((p: any) => p.id === pujaId)
              if (matched) setPuja(matched)
            }
          }
        }

        // Fetch current user details
        const meRes = await fetch('/api/health')
        const meData = await meRes.json()
        setUser(meData.user || { fullName: 'Devotee', email: 'devotee@devyajnam.com' })
        setSankalpText(meData.user?.fullName || '')
      } catch (err) {
        console.error('Error initializing:', err)
      } finally {
        setLoading(false)
      }
    }
    init()
  }, [pujaId])

  const handleAddMember = () => {
    if (!mName) {
      toast.error('Family member name is required')
      return
    }
    setFamilyMembers([
      ...familyMembers,
      { fullName: mName, gotra: mGotra || gotra, relation: mRelation, age: mAge }
    ])
    setMName('')
    setMGotra('')
    setMAge('')
    toast.success('Family member added to Sankalp list')
  }

  const handleRemoveMember = (idx: number) => {
    setFamilyMembers(familyMembers.filter((_, i) => i !== idx))
  }

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!puja) {
      toast.error('No Puja selected')
      return
    }
    if (!sankalpText) {
      toast.error('Sankalp / Devotee Name is required')
      return
    }

    try {
      setSubmitting(true)
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pujaId: puja.id,
          sankalpText,
          gotra,
          specialInstructions,
          familyMembers
        })
      })

      const data = await res.json()
      if (res.ok && data.ok) {
        setSuccessBooking(data.booking)
        toast.success('Sankalp booking created successfully!')
      } else {
        toast.error(data.error || 'Failed to create booking. Please make sure you are logged in.')
      }
    } catch (err: any) {
      toast.error('Network error creating booking')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="container max-w-lg mx-auto py-32 text-center space-y-4">
        <Loader2 className="h-10 w-10 text-primary animate-spin mx-auto" />
        <p className="text-muted-foreground font-medium">Preparing booking form details…</p>
      </div>
    )
  }

  if (successBooking) {
    return (
      <div className="container max-w-2xl mx-auto py-16 px-4">
        <Card className="border-emerald-200 bg-emerald-50/5 text-center overflow-hidden shadow-2xl">
          <div className="bg-emerald-600 text-white py-10 space-y-2">
            <CheckCircle2 className="h-16 w-16 mx-auto animate-bounce text-emerald-100" />
            <h2 className="text-3xl font-black tracking-tight">Sankalp Registered Successfully!</h2>
            <p className="text-sm text-emerald-100 font-medium font-mono uppercase tracking-widest">Booking Ref: {successBooking.bookingNumber}</p>
          </div>
          <CardContent className="p-8 space-y-6">
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-foreground">Sawan Puja Sankalp Details</h3>
              <p className="text-sm text-muted-foreground">Your sacred booking has been recorded in our permanent database.</p>
            </div>

            <div className="bg-background border rounded-xl p-5 text-left space-y-4 divide-y divide-border/60">
              <div className="pb-3 grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-xs text-muted-foreground block">Selected Puja Event</span>
                  <span className="font-bold text-foreground">{successBooking.pujaName}</span>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground block">Sankalp Devotee</span>
                  <span className="font-bold text-foreground">{successBooking.sankalpText}</span>
                </div>
              </div>

              <div className="pt-3 pb-3 grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-xs text-muted-foreground block">Gotra Recitation</span>
                  <span className="font-semibold text-foreground">{successBooking.gotra || '— (Pandit will use standard Shiv/Kashyap gotra)'}</span>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground block">Total Amount Paid</span>
                  <span className="font-extrabold text-amber-600 text-base">₹{parseFloat(successBooking.total || '0').toLocaleString('en-IN')}</span>
                </div>
              </div>

              {familyMembers.length > 0 && (
                <div className="pt-3">
                  <span className="text-xs text-muted-foreground block mb-2">Family Members Enrolled:</span>
                  <div className="flex flex-wrap gap-2">
                    {familyMembers.map((m, i) => (
                      <Badge key={i} variant="secondary" className="px-2.5 py-1 text-xs">
                        {m.fullName} ({m.relation})
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className="flex gap-3 text-left bg-amber-50/50 p-4 rounded-lg border border-amber-200/50 text-xs text-amber-900 leading-relaxed">
                <Landmark className="h-5 w-5 text-amber-600 flex-shrink-0" />
                <p>
                  <strong>What happens next?</strong> Authorized Vedic pandits will recite your specific name, gotra, and wishes during the live event. Direct links to watch the live-stream will be available on your devotee dashboard. Holy prasad will be packed under pure hygienic conditions and dispatched to your physical address.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Button className="flex-1 bg-primary hover:bg-primary/95 text-white" asChild>
                  <Link href="/dashboard">Go to Devotee Dashboard</Link>
                </Button>
                <Button variant="outline" className="flex-1" asChild>
                  <Link href="/">Back to Homepage</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!puja) {
    return (
      <div className="container max-w-lg mx-auto py-24 text-center space-y-6 px-4">
        <Badge variant="destructive" className="px-3 py-1">⚠️ Error</Badge>
        <h2 className="text-2xl font-black">Sankalp Puja Not Found</h2>
        <p className="text-muted-foreground">The requested Puja session is either unavailable or has already concluded.</p>
        <Button asChild><Link href="/pujas">Browse Active Pujas</Link></Button>
      </div>
    )
  }

  return (
    <div className="container max-w-5xl mx-auto py-12 px-4 space-y-8">
      <div className="flex items-center gap-2">
        <Link href="/pujas" className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5 text-sm">
          <ArrowLeft className="h-4 w-4" /> Back to Pujas
        </Link>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Event details column */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="overflow-hidden border border-amber-200/50 shadow-md">
            <div className="aspect-[4/3] relative bg-muted">
              <img src={puja.coverImage || DEFAULT_PLACEHOLDER_IMAGE} alt={puja.name} className="w-full h-full object-cover" />
            </div>
            <CardContent className="p-5 space-y-4">
              <div>
                <Badge className="bg-amber-100 border-amber-200 text-amber-800 text-[10px] font-bold uppercase tracking-wide mb-2">Selected Puja</Badge>
                <h3 className="font-extrabold text-lg text-foreground leading-tight">{puja.name}</h3>
                <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                  <Landmark className="h-3 w-3" /> {puja.temple?.name || 'Authorized Temple'}
                </p>
              </div>

              <div className="border-t pt-4 flex items-center justify-between">
                <div>
                  <span className="text-xs text-muted-foreground block">Sankalp Dakshina</span>
                  <span className="text-2xl font-black text-amber-600">₹{parseFloat(puja.price?.toString() || '0').toLocaleString('en-IN')}</span>
                </div>
                {puja.isVip && (
                  <Badge className="bg-red-100 text-red-800 border-red-200 font-bold">⭐ VIP EVENT</Badge>
                )}
              </div>

              <div className="space-y-2 bg-muted/30 p-3.5 rounded-lg text-xs text-muted-foreground">
                <div className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-emerald-600" /> Authorized Vedic Priests</div>
                <div className="flex items-center gap-2"><Video className="h-4 w-4 text-emerald-600" /> Live Stream and Digital Sankalp Video</div>
                <div className="flex items-center gap-2"><Sparkles className="h-4 w-4 text-emerald-600" /> Holy Prasad Delivery Included</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Booking Form column */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="shadow-lg border">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-bold flex items-center gap-2">🕊️ Devotee Sankalp Form</CardTitle>
              <CardDescription>Fill in your birth coordinates and personal wishes to be chanted during the auspicious rituals.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleFormSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="sankalp-text">Main Devotee Full Name *</Label>
                    <Input 
                      id="sankalp-text" 
                      required 
                      value={sankalpText} 
                      onChange={(e) => setSankalpText(e.target.value)} 
                      placeholder="e.g. Ramesh Kumar" 
                    />
                    <p className="text-[10px] text-muted-foreground">The specific name that will be chanted by the priest.</p>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="gotra-input">Gotra (if known)</Label>
                    <Input 
                      id="gotra-input" 
                      value={gotra} 
                      onChange={(e) => setGotra(e.target.value)} 
                      placeholder="e.g. Kashyap / Bhardwaj" 
                    />
                    <p className="text-[10px] text-muted-foreground">Leave empty if unknown (priests will use Shiv gotra).</p>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="special-inst">Manokamna / Special Wishes & Instructions</Label>
                  <Textarea 
                    id="special-inst" 
                    rows={3} 
                    value={specialInstructions}
                    onChange={(e) => setSpecialInstructions(e.target.value)}
                    placeholder="Describe specific wishes, health/career concerns, or gotra details to be stated during puja recitation..." 
                  />
                </div>

                {/* FAMILY MEMBERS SUB-FORM */}
                <div className="border rounded-xl p-4 bg-muted/10 space-y-4">
                  <div className="flex items-center gap-2 pb-2 border-b">
                    <Users className="h-4 w-4 text-primary" />
                    <div>
                      <h4 className="font-bold text-xs text-foreground">Add Family Members to Sankalp</h4>
                      <p className="text-[10px] text-muted-foreground">Include names of spouse, children, or parents to receive equal blessings.</p>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-4 gap-2.5 items-end">
                    <div className="space-y-1">
                      <Label htmlFor="m-name" className="text-[11px] font-bold">Name</Label>
                      <Input id="m-name" size={30} value={mName} onChange={(e) => setMName(e.target.value)} placeholder="Name" className="h-8.5 text-xs" />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="m-gotra" className="text-[11px] font-bold">Gotra</Label>
                      <Input id="m-gotra" size={30} value={mGotra} onChange={(e) => setMGotra(e.target.value)} placeholder="Gotra" className="h-8.5 text-xs" />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="m-relation" className="text-[11px] font-bold">Relation</Label>
                      <select 
                        id="m-relation" 
                        value={mRelation} 
                        onChange={(e) => setMRelation(e.target.value)}
                        className="flex h-8.5 w-full rounded-md border border-input bg-background px-2 py-1 text-xs shadow-sm transition-colors"
                      >
                        <option value="Spouse">Spouse</option>
                        <option value="Son">Son</option>
                        <option value="Daughter">Daughter</option>
                        <option value="Mother">Mother</option>
                        <option value="Father">Father</option>
                        <option value="Sister">Sister</option>
                        <option value="Brother">Brother</option>
                      </select>
                    </div>
                    <div className="flex gap-1.5">
                      <div className="space-y-1 flex-1">
                        <Label htmlFor="m-age" className="text-[11px] font-bold">Age</Label>
                        <Input id="m-age" type="number" size={30} value={mAge} onChange={(e) => setMAge(e.target.value)} placeholder="Age" className="h-8.5 text-xs" />
                      </div>
                      <Button type="button" size="sm" variant="secondary" className="h-8.5" onClick={handleAddMember}>
                        <Plus className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>

                  {familyMembers.length > 0 && (
                    <div className="pt-2">
                      <p className="text-[10px] font-bold text-foreground mb-1.5">Enrolled Family Members ({familyMembers.length}):</p>
                      <div className="space-y-1.5">
                        {familyMembers.map((member, i) => (
                          <div key={i} className="flex items-center justify-between text-xs bg-background p-2 rounded-md border border-muted/60">
                            <span>
                              <strong>{member.fullName}</strong> ({member.relation}) {member.gotra && `• Gotra: ${member.gotra}`} {member.age && `• Age: ${member.age}`}
                            </span>
                            <Button 
                              type="button" 
                              variant="ghost" 
                              size="icon" 
                              className="h-6 w-6 text-red-600 hover:text-red-700"
                              onClick={() => handleRemoveMember(i)}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-2">
                  <Button 
                    type="submit" 
                    className="w-full bg-primary hover:bg-primary/95 text-white font-bold h-11"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" /> Registering Sankalp in Database...
                      </span>
                    ) : (
                      `Proceed to Book Sankalp • ₹${parseFloat(puja.price?.toString() || '0').toLocaleString('en-IN')}`
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
