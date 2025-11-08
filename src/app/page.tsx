"use client";
import React, { useEffect, useMemo, useState } from "react";
import { ShoppingCart, PhoneCall, Mail, Filter, IndianRupee, Search, CheckCircle2, MapPin, Sparkles, Package, Trash2, Plus, Minus, ChevronRight, ShieldCheck, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetFooter } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";


// --- Mock Catalog Data (customize later) ---
const PRODUCTS = [
  { id: "IM-001", name: "Immersion Heater – SS304", category: "Immersion", wattage: 1500, voltage: 230, material: "SS304", price: 799, leadDays: 3, img: "https://placehold.co/600x400?text=Immersion+SS304", desc: "Household/industrial hot water; BSP thread; moisture sealed." },
  { id: "IM-002", name: "Immersion Heater – Incoloy 800", category: "Immersion", wattage: 2000, voltage: 230, material: "Incoloy 800", price: 1299, leadDays: 4, img: "https://placehold.co/600x400?text=Immersion+Incoloy+800", desc: "Corrosion resistant alloy; for hard water/chemicals." },
  { id: "TB-010", name: "Tubular Heater – Finned", category: "Tubular", wattage: 3000, voltage: 415, material: "SS304", price: 2899, leadDays: 6, img: "https://placehold.co/600x400?text=Tubular+Finned", desc: "Air/duct heating; high surface area fins for efficiency." },
  { id: "TB-011", name: "Tubular Heater – U-Bend", category: "Tubular", wattage: 2500, voltage: 230, material: "SS316", price: 2699, leadDays: 5, img: "https://placehold.co/600x400?text=Tubular+U-Bend", desc: "Oil/water; custom bend radius and cold sections." },
  { id: "BD-020", name: "Band Heater – Mica", category: "Band", wattage: 1000, voltage: 230, material: "Mica", price: 1499, leadDays: 3, img: "https://placehold.co/600x400?text=Band+Mica", desc: "Plastic extrusion/injection machines; up to 300°C." },
  { id: "BD-021", name: "Band Heater – Ceramic", category: "Band", wattage: 2500, voltage: 230, material: "Ceramic", price: 3299, leadDays: 7, img: "https://placehold.co/600x400?text=Band+Ceramic", desc: "High temp up to 650°C; energy efficient insulation." },
  { id: "CR-030", name: "Cartridge Heater – High Density", category: "Cartridge", wattage: 500, voltage: 230, material: "Incoloy 800", price: 899, leadDays: 4, img: "https://placehold.co/600x400?text=Cartridge+High+Density", desc: "Molds/dies; precision fit; uniform heat profile." },
  { id: "CR-031", name: "Cartridge Heater – SS321", category: "Cartridge", wattage: 750, voltage: 230, material: "SS321", price: 999, leadDays: 4, img: "https://placehold.co/600x400?text=Cartridge+SS321", desc: "General purpose; swaged construction; long life." },
];

const CATEGORIES = ["All", "Immersion", "Tubular", "Band", "Cartridge"];
const MATERIALS = ["All", "SS304", "SS316", "SS321", "Incoloy 800", "Mica", "Ceramic"]; 
const VOLTAGES = ["All", "110", "230", "415"];

function inr(n){
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);
}

function useLocalStorage(key, initial){
  const [value, setValue] = useState(() => {
    if (typeof window === 'undefined') return initial;
    try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : initial; } catch { return initial; }
  });
  useEffect(() => { try { localStorage.setItem(key, JSON.stringify(value)); } catch {} }, [key, value]);
  return [value, setValue];
}

export default function HeaterFactorySite(){
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState("All");
  const [mat, setMat] = useState("All");
  const [volt, setVolt] = useState("All");
  const [sort, setSort] = useState("popular");
  const [cart, setCart] = useLocalStorage("hf_cart", []);
  const [lastOrder, setLastOrder] = useLocalStorage("hf_last_order", null);
  const [contact, setContact] = useState({ name: "", email: "", phone: "", message: "" });
  // 👇 ADDED THESE TWO LINES TO FIX THE HYDRATION ERROR
  const [isClient, setIsClient] = useState(false);
  useEffect(() => { setIsClient(true) }, []);

  const filtered = useMemo(() => {
    const list = PRODUCTS.filter(p => 
      (cat === "All" || p.category === cat) &&
      (mat === "All" || p.material === mat) &&
      (volt === "All" || String(p.voltage) === volt) &&
      (query.trim() === "" || (p.name + p.desc + p.id).toLowerCase().includes(query.toLowerCase()))
    );
    if (sort === "price-asc") list.sort((a,b)=>a.price-b.price);
    else if (sort === "price-desc") list.sort((a,b)=>b.price-a.price);
    else if (sort === "watt-desc") list.sort((a,b)=>b.wattage-a.wattage);
    return list;
  }, [query, cat, mat, volt, sort]);

  const cartTotal = useMemo(() => cart.reduce((s,i)=>s + i.price * i.qty, 0), [cart]);

  function addToCart(p){
    setCart(prev => {
      const ex = prev.find(i => i.id === p.id);
      if (ex){ return prev.map(i => i.id===p.id ? { ...i, qty: i.qty + 1 } : i); }
      return [...prev, { id: p.id, name: p.name, price: p.price, qty: 1 }];
    });
  }
  function inc(id){ setCart(prev => prev.map(i => i.id===id?{...i, qty:i.qty+1}:i)); }
  function dec(id){ setCart(prev => prev.map(i => i.id===id?{...i, qty: Math.max(1, i.qty-1)}:i)); }
  function delItem(id){ setCart(prev => prev.filter(i=>i.id!==id)); }
  function clearCart(){ setCart([]); }

  function placeOrder(form){
    const { custName, phone, company, email, address, city, state, pincode, gst, notes, delivery, payment } = form;
    if (!custName || !phone || !address){ alert("Please fill Name, Phone, and Address."); return; }
    if (cart.length === 0){ alert("Your cart is empty."); return; }
    const orderId = `HF-${new Date().toISOString().slice(0,10).replace(/-/g,'')}-${Math.floor(Math.random()*9000+1000)}`;
    const payload = { orderId, when: new Date().toISOString(), items: cart, amount: cartTotal, customer: { custName, phone, company, email, address, city, state, pincode, gst, notes, delivery, payment } };
    setLastOrder(payload);
    clearCart();
    const summary = encodeURIComponent(
      [
        `NEW ORDER ${orderId}`,
        `Name: ${custName}`,
        company?`Company: ${company}`:null,
        email?`Email: ${email}`:null,
        `Phone: ${phone}`,
        `Address: ${address}, ${city||''}, ${state||''} - ${pincode||''}`,
        gst?`GST: ${gst}`:null,
        `Delivery: ${delivery}`,
        `Payment: ${payment}`,
        `Items:`,
        ...payload.items.map(i=>`• ${i.name} x ${i.qty} = ${inr(i.price*i.qty)}`),
        `Total: ${inr(payload.amount)}`,
        notes?`Notes: ${notes}`:null
      ].filter(Boolean).join("\n")
    );
    // Change this target number to your sales/WhatsApp number
    const whatsappNumber = "917518959561"; // e.g., 91 + 10-digit mobile
    window.open(`https://wa.me/${whatsappNumber}?text=${summary}`, "_blank");
    alert(`Order placed! Your Order ID is ${orderId}. We've opened WhatsApp with order details.`);
  }

  function submitContact(){
    if (!contact.name || !contact.phone || !contact.message){ alert("Please fill Name, Phone, and Message."); return; }
    const text = encodeURIComponent(`Inquiry from ${contact.name}\nPhone: ${contact.phone}\nEmail: ${contact.email||'-'}\n\n${contact.message}`);
    const whatsappNumber = "918595432960";
    window.open(`https://wa.me/${whatsappNumber}?text=${text}`, "_blank");
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white text-slate-900">
      {/* Top Bar */}
      <div className="w-full border-b bg-white sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6" />
            <span className="font-bold text-xl">Vikas Industrial Heaters</span>
            <Badge variant="secondary" className="ml-2">ISO 9001:2015</Badge>
          </div>
          <div className="hidden md:flex items-center gap-2 w-[40%]">
            <div className="relative w-full">
              <Search className="absolute left-3 top-2.5 h-4 w-4" />
              <Input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search heaters, SKU, features…" className="pl-9" />
            </div>
            <Button variant="outline" onClick={()=>{setQuery(""); setCat("All"); setMat("All"); setVolt("All"); setSort("popular");}}>
              <Filter className="h-4 w-4 mr-2"/>Reset
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <a href="tel:+918595432960"><Button variant="outline"><PhoneCall className="h-4 w-4 mr-2"/>Call</Button></a>
            <a href="mailto:aakashpriyadarshi2002@gmail.com"><Button variant="outline"><Mail className="h-4 w-4 mr-2"/>Email</Button></a>
            <Sheet>
              <SheetTrigger asChild>
                <Button className="relative"><ShoppingCart className="h-4 w-4 mr-2"/>Cart {isClient &&cart.length>0 && (<Badge className="ml-2" variant="secondary">{cart.reduce((s,i)=>s+i.qty,0)}</Badge>)}</Button>
              </SheetTrigger>
              <SheetContent className="w-full sm:max-w-md overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>Your Cart</SheetTitle>
                </SheetHeader>
                <div className="mt-4 space-y-3">
                  {cart.length===0 && <p className="text-sm text-slate-600">Your cart is empty.</p>}
                  {cart.map(item => (
                    <Card key={item.id}>
                      <CardContent className="p-4 flex items-center justify-between gap-2">
                        <div>
                          <div className="font-medium">{item.name}</div>
                          <div className="text-xs text-slate-500">SKU: {item.id}</div>
                          <div className="text-sm mt-1">{inr(item.price)} <span className="text-slate-500">× {item.qty}</span></div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button size="icon" variant="outline" onClick={()=>dec(item.id)}><Minus className="h-4 w-4"/></Button>
                          <Button size="icon" variant="outline" onClick={()=>inc(item.id)}><Plus className="h-4 w-4"/></Button>
                          <Button size="icon" variant="destructive" onClick={()=>delItem(item.id)}><Trash2 className="h-4 w-4"/></Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                <Separator className="my-3"/>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-slate-600">Subtotal</div>
                  <div className="font-semibold">{inr(cartTotal)}</div>
                </div>
                <div className="text-xs text-slate-500 mt-1">* GST and freight calculated in final invoice.</div>
                <div className="flex gap-2 mt-4">
                  <Button variant="outline" onClick={clearCart}>Clear</Button>
                  <OrderDialog onSubmit={placeOrder} disabled={cart.length===0} />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      {/* Hero */}
      <section className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-10 grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-3xl md:text-5xl font-extrabold leading-tight">Industrial & Custom Heaters
              <span className="block text-slate-500 text-xl md:text-2xl mt-2">Built to spec. Delivered fast.</span>
            </h1>
            <ul className="mt-6 grid gap-2 text-slate-700">
              <li className="flex items-center gap-2"><ShieldCheck className="h-5 w-5"/> 1‑year warranty & ISO certified</li>
              <li className="flex items-center gap-2"><Truck className="h-5 w-5"/> Pan‑India shipping, 3–7 day lead time</li>
              <li className="flex items-center gap-2"><Package className="h-5 w-5"/> OEM & bulk orders supported</li>
            </ul>
            <div className="mt-6 flex gap-3">
              <a href="#catalog"><Button className="">Browse Products</Button></a>
              <a href="#contact"><Button variant="outline">Get a Quote</Button></a>
            </div>
          </div>
          <div>
            <div className="aspect-[4/3] w-full rounded-2xl bg-gradient-to-tr from-orange-100 via-amber-50 to-white grid place-items-center border">
              <div className="text-center p-6">
                <div className="text-6xl">🔥</div>
                <p className="mt-3 text-slate-700">Immersion • Tubular • Band • Cartridge</p>
                <p className="text-sm text-slate-500">Precision engineered heating solutions for water, oil, air, molds & machinery.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section id="catalog" className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-end gap-3 md:gap-4 justify-between">
          <div className="flex-1 grid sm:grid-cols-2 md:grid-cols-4 gap-3">
            <div>
              <Label>Category</Label>
              <Select value={cat} onValueChange={setCat}>
                <SelectTrigger><SelectValue placeholder="All"/></SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Material</Label>
              <Select value={mat} onValueChange={setMat}>
                <SelectTrigger><SelectValue placeholder="All"/></SelectTrigger>
                <SelectContent>
                  {MATERIALS.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Voltage</Label>
              <Select value={volt} onValueChange={setVolt}>
                <SelectTrigger><SelectValue placeholder="All"/></SelectTrigger>
                <SelectContent>
                  {VOLTAGES.map(v => <SelectItem key={v} value={v}>{v} {v!=="All"?"V":""}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Sort by</Label>
              <Select value={sort} onValueChange={setSort}>
                <SelectTrigger><SelectValue placeholder="Popular"/></SelectTrigger>
                <SelectContent>
                  <SelectItem value="popular">Popular</SelectItem>
                  <SelectItem value="price-asc">Price: Low to High</SelectItem>
                  <SelectItem value="price-desc">Price: High to Low</SelectItem>
                  <SelectItem value="watt-desc">Wattage: High to Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="md:hidden">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4" />
              <Input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search heaters, SKU, features…" className="pl-9" />
            </div>
          </div>
        </div>

        {/* Grid */}
        <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map(p => (
            <Card key={p.id} className="group overflow-hidden">
              <div className="aspect-video bg-white grid place-items-center overflow-hidden">
                <img src={p.img} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition"/>
              </div>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-3">
                  <CardTitle className="text-base leading-tight">{p.name}</CardTitle>
                  <Badge>{p.category}</Badge>
                </div>
                <CardDescription className="text-xs">{p.desc}</CardDescription>
              </CardHeader>
              <CardContent className="pt-0 text-sm">
                <div className="flex flex-wrap gap-2 mb-2">
                  <Badge variant="secondary">{p.wattage} W</Badge>
                  <Badge variant="secondary">{p.voltage} V</Badge>
                  <Badge variant="secondary">{p.material}</Badge>
                  <Badge variant="outline">Lead {p.leadDays} days</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-xl font-bold flex items-center"><IndianRupee className="h-5 w-5 mr-1"/>{p.price}</div>
                  <div className="text-xs text-slate-500">SKU: {p.id}</div>
                </div>
              </CardContent>
              <CardFooter className="flex gap-2">
                <Button className="w-full" onClick={()=>addToCart(p)}>
                  <ShoppingCart className="h-4 w-4 mr-2"/>Add to cart
                </Button>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="whitespace-nowrap">Details</Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-xl">
                    <DialogHeader>
                      <DialogTitle>{p.name}</DialogTitle>
                      <DialogDescription>SKU {p.id} • {p.category}</DialogDescription>
                    </DialogHeader>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <img src={p.img} alt={p.name} className="rounded-xl border"/>
                      <div className="text-sm space-y-2">
                        <p>{p.desc}</p>
                        <Separator/>
                        <ul className="grid gap-1">
                          <li>Wattage: <b>{p.wattage} W</b></li>
                          <li>Voltage: <b>{p.voltage} V</b></li>
                          <li>Material: <b>{p.material}</b></li>
                          <li>Lead time: <b>{p.leadDays} days</b></li>
                          <li>Price: <b>{inr(p.price)}</b></li>
                        </ul>
                        <div className="pt-2 flex gap-2">
                          <Button onClick={()=>addToCart(p)}><ShoppingCart className="h-4 w-4 mr-2"/>Add to cart</Button>
                          <a className="inline-flex" target="_blank" href={`https://wa.me/919999999999?text=${encodeURIComponent("Hi, I'm interested in "+p.name+" ("+p.id+") – please share best price and lead time.")}`}>
                            <Button variant="outline"><PhoneCall className="h-4 w-4 mr-2"/>WhatsApp</Button>
                          </a>
                        </div>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardFooter>
            </Card>
          ))}
        </div>

        {filtered.length===0 && (
          <div className="text-center py-16 text-slate-600">
            No products match your filters.
          </div>
        )}
      </section>

      {/* Trust Bar */}
      <section className="bg-slate-50 border-y">
        <div className="max-w-7xl mx-auto px-4 py-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <TrustItem icon={<ShieldCheck className="h-6 w-6"/>} title="Quality First" text="Nickel-chrome wire, high-grade sheath, 100% QC"/>
          <TrustItem icon={<Truck className="h-6 w-6"/>} title="Fast Dispatch" text="Standard SKUs ship in 48–72 hours"/>
          <TrustItem icon={<CheckCircle2 className="h-6 w-6"/>} title="Custom Build" text="Voltage, wattage, fittings as per drawing"/>
          <TrustItem icon={<Package className="h-6 w-6"/>} title="After‑Sales" text="1‑year warranty & spares support"/>
        </div>
      </section>

      {/* Contact & Quote */}
      <section id="contact" className="max-w-7xl mx-auto px-4 py-12 grid lg:grid-cols-2 gap-8">
        <Card className="order-2 lg:order-1">
          <CardHeader>
            <CardTitle>Contact & Custom Quote</CardTitle>
            <CardDescription>Share your requirement. We reply within 24 hours.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3">
            <div className="grid sm:grid-cols-2 gap-3">
              <div> 
                <Label>Name*</Label>
                <Input value={contact.name} onChange={e=>setContact({...contact, name:e.target.value})} placeholder="Your name"/>
              </div>
              <div>
                <Label>Phone*</Label>
                <Input value={contact.phone} onChange={e=>setContact({...contact, phone:e.target.value})} placeholder="10‑digit mobile"/>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <Label>Email</Label>
                <Input value={contact.email} onChange={e=>setContact({...contact, email:e.target.value})} placeholder="name@email.com"/>
              </div>
              <div>
                <Label>Product</Label>
                <Select onValueChange={(v)=>setContact({...contact, message:`${contact.message}${contact.message?"\n" : ""}Product: ${v}`})}>
                  <SelectTrigger><SelectValue placeholder="Select product"/></SelectTrigger>
                  <SelectContent>
                    {PRODUCTS.map(p=> <SelectItem key={p.id} value={`${p.name} (${p.id})`}>{p.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label>Your message*</Label>
              <Textarea rows={5} value={contact.message} onChange={e=>setContact({...contact, message:e.target.value})} placeholder="Describe voltage, wattage, size, medium (water/oil/air), quantity, drawings if any…"/>
            </div>
            <div className="flex gap-2">
              <Button onClick={submitContact}><PhoneCall className="h-4 w-4 mr-2"/>WhatsApp</Button>
              <a target="_blank" href={`mailto:sales@patilheaters.com?subject=${encodeURIComponent("Inquiry from "+(contact.name||"Website"))}&body=${encodeURIComponent(`Phone: ${contact.phone||'-'}\nEmail: ${contact.email||'-'}\n\n${contact.message||''}`)}`}>
                <Button variant="outline"><Mail className="h-4 w-4 mr-2"/>Email</Button>
              </a>
            </div>
          </CardContent>
        </Card>
        <Card className="order-1 lg:order-2">
          <CardHeader>
            <CardTitle>Factory & Office</CardTitle>
            <CardDescription>We welcome OEMs and traders.</CardDescription>
          </CardHeader>
          <CardContent className="text-sm space-y-3">
            <div className="flex items-start gap-3"><MapPin className="h-5 w-5 mt-0.5"/>
              <div>
                Vikas Industrial Heaters<br/>
                F-148, DSIIDC Industrial Area, Bawana Sector 5<br/>
                Delhi – 110039, India
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <div className="text-slate-500">Sales</div>
                <a className="underline" href="tel:+919999999999">+91 88003 41319</a><br/>
                <a className="underline" href="mailto:sales@patilheaters.com">kapildev54444@gmail.com</a>
              </div>
              <div>
                <div className="text-slate-500">Support</div>
                <a className="underline" href="tel:+918888888888">+91 85954 32960</a><br/>
                <a className="underline" href="mailto:support@patilheaters.com">aakashpriyadarshi2002@gmail.com</a>
              </div>
            </div>
            <div className="rounded-xl overflow-hidden border">
              <iframe title="map" className="w-full h-64" loading="lazy" referrerPolicy="no-referrer-when-downgrade" src="https://www.google.com/maps?q=MIDC%20VikasElectricalsandHeatingElementsBawanaSector5&output=embed"></iframe>
            </div>
            <div className="text-xs text-slate-500">* Replace placeholder numbers/emails and map pin with your actual details.</div>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white">
        <div className="max-w-7xl mx-auto px-4 py-8 grid md:grid-cols-3 gap-6 text-sm">
          <div>
            <div className="font-bold text-lg">Vikas Industrial Heaters</div>
            <p className="text-slate-600 mt-2">Manufacturing immersion, tubular, band and cartridge heaters for industrial and OEM applications since 1998.</p>
          </div>
          <div>
            <div className="font-semibold">Quick Links</div>
            <ul className="mt-2 grid gap-1">
              <li><a className="underline" href="#catalog">Catalog</a></li>
              <li><a className="underline" href="#contact">Contact</a></li>
              <li><a className="underline" href="#">Warranty</a></li>
              <li><a className="underline" href="#">Privacy Policy</a></li>
            </ul>
          </div>
          <div>
            <div className="font-semibold">Order Status</div>
            {isClient && lastOrder ? (
              <div className="mt-2 p-3 rounded-xl bg-slate-50 border">
                <div className="text-slate-500">Last Order</div>
                <div className="font-semibold">{lastOrder.orderId}</div>
                <div className="text-xs text-slate-500">Amount: {inr(lastOrder.amount)}</div>
                <a className="underline text-xs" target="_blank" href={`https://wa.me/917518959561?text=${encodeURIComponent("Order status update for "+lastOrder.orderId)}`}>Ping us on WhatsApp</a>
              </div>
            ) : (
              <p className="text-slate-600 mt-2">Add items to cart and place your first order.</p>
            )}
          </div>
        </div>
        <div className="text-xs text-slate-500 text-center py-4 border-t">© {new Date().getFullYear()} Patil Heaters Pvt. Ltd. All rights reserved.</div>
      </footer>
    </div>
  );
}

function TrustItem({icon, title, text}){
  return (
    <div className="flex items-start gap-3 p-4 rounded-2xl bg-white border shadow-sm">
      <div className="shrink-0">{icon}</div>
      <div>
        <div className="font-semibold">{title}</div>
        <div className="text-slate-600 text-sm">{text}</div>
      </div>
    </div>
  );
}

function OrderDialog({ onSubmit, disabled }){
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ custName: "", phone: "", company: "", email: "", address: "", city: "", state: "", pincode: "", gst: "", notes: "", delivery: "Standard (Surface)", payment: "Advance 50%" });
  function handleSubmit(){ onSubmit(form); setOpen(false); }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button disabled={disabled} className="w-full">Checkout <ChevronRight className="h-4 w-4 ml-2"/></Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Checkout</DialogTitle>
          <DialogDescription>Enter shipping & billing details to place order on WhatsApp.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-3 text-sm">
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <Label>Name*</Label>
              <Input value={form.custName} onChange={e=>setForm({...form, custName:e.target.value})} placeholder="Full name"/>
            </div>
            <div>
              <Label>Phone*</Label>
              <Input value={form.phone} onChange={e=>setForm({...form, phone:e.target.value})} placeholder="10‑digit mobile"/>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <Label>Company</Label>
              <Input value={form.company} onChange={e=>setForm({...form, company:e.target.value})} placeholder="Company (optional)"/>
            </div>
            <div>
              <Label>Email</Label>
              <Input value={form.email} onChange={e=>setForm({...form, email:e.target.value})} placeholder="name@email.com"/>
            </div>
          </div>
          <div>
            <Label>Address*</Label>
            <Textarea rows={2} value={form.address} onChange={e=>setForm({...form, address:e.target.value})} placeholder="Street, area, building"/>
          </div>
          <div className="grid sm:grid-cols-3 gap-3">
            <div>
              <Label>City</Label>
              <Input value={form.city} onChange={e=>setForm({...form, city:e.target.value})} />
            </div>
            <div>
              <Label>State</Label>
              <Input value={form.state} onChange={e=>setForm({...form, state:e.target.value})} />
            </div>
            <div>
              <Label>Pincode</Label>
              <Input value={form.pincode} onChange={e=>setForm({...form, pincode:e.target.value})} />
            </div>
          </div>
          <div className="grid sm:grid-cols-3 gap-3">
            <div>
              <Label>GSTIN</Label>
              <Input value={form.gst} onChange={e=>setForm({...form, gst:e.target.value})} placeholder="If applicable"/>
            </div>
            <div>
              <Label>Delivery</Label>
              <Select value={form.delivery} onValueChange={v=>setForm({...form, delivery:v})}>
                <SelectTrigger><SelectValue/></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Standard (Surface)">Standard (Surface)</SelectItem>
                  <SelectItem value="Express (Air)">Express (Air)</SelectItem>
                  <SelectItem value="Pickup (Ex‑Works)">Pickup (Ex‑Works)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Payment</Label>
              <Select value={form.payment} onValueChange={v=>setForm({...form, payment:v})}>
                <SelectTrigger><SelectValue/></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Advance 50%">Advance 50%</SelectItem>
                  <SelectItem value="Advance 100%">Advance 100%</SelectItem>
                  <SelectItem value="PO with Credit">PO with Credit</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label>Notes</Label>
            <Textarea rows={3} value={form.notes} onChange={e=>setForm({...form, notes:e.target.value})} placeholder="Any special requirements (threads, flanges, drawings ID, packing, etc.)"/>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={()=>setOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit}>Place Order</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
