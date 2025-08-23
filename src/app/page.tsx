"use client";
import React, { useEffect, useMemo, useState } from "react";
import {
  ShoppingCart, PhoneCall, Mail, Filter, IndianRupee, Search,
  CheckCircle2, MapPin, Sparkles, Package, Trash2, Plus, Minus,
  ShieldCheck, Truck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card, CardContent, CardFooter, CardHeader,
  CardTitle, CardDescription
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger
} from "@/components/ui/sheet";
import {
  Dialog, DialogContent, DialogDescription,
  DialogHeader, DialogTitle, DialogTrigger
} from "@/components/ui/dialog";

// --- Mock Catalog Data ---
const PRODUCTS = [
  { id: "IM-001", name: "Immersion Heater – SS304", category: "Immersion", wattage: 1500, voltage: 230, material: "SS304", price: 799, leadDays: 3, img: "https://placehold.co/600x400?text=Immersion+SS304", desc: "Household/industrial hot water; BSP thread; moisture sealed." },
  { id: "IM-002", name: "Immersion Heater – Incoloy 800", category: "Immersion", wattage: 2000, voltage: 230, material: "Incoloy 800", price: 1299, leadDays: 4, img: "https://placehold.co/600x400?text=Immersion+Incoloy+800", desc: "Corrosion resistant alloy; for hard water/chemicals." },
];

const CATEGORIES = ["All", "Immersion", "Tubular", "Band", "Cartridge"];
const MATERIALS = ["All", "SS304", "SS316", "SS321", "Incoloy 800", "Mica", "Ceramic"];
const VOLTAGES = ["All", "110", "230", "415"];

// Safe INR formatter
function inr(n) {
  try {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(n);
  } catch {
    return `₹${n}`;
  }
}

// Safe localStorage hook
function useLocalStorage(key, initial) {
  const [value, setValue] = useState(initial);
  useEffect(() => {
    try {
      const v = window.localStorage.getItem(key);
      if (v) setValue(JSON.parse(v));
    } catch {}
  }, [key]);
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {}
  }, [key, value]);
  return [value, setValue];
}

export default function HeaterFactorySite() {
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState("All");
  const [mat, setMat] = useState("All");
  const [volt, setVolt] = useState("All");
  const [sort, setSort] = useState("popular");
  const [cart, setCart] = useLocalStorage("hf_cart", []);
  const [lastOrder, setLastOrder] = useLocalStorage("hf_last_order", null);
  const [contact, setContact] = useState({ name: "", email: "", phone: "", message: "" });

  const filtered = useMemo(() => {
    const list = PRODUCTS.filter(p =>
      (cat === "All" || p.category === cat) &&
      (mat === "All" || p.material === mat) &&
      (volt === "All" || String(p.voltage) === volt) &&
      (query.trim() === "" || (p.name + p.desc + p.id).toLowerCase().includes(query.toLowerCase()))
    );
    if (sort === "price-asc") list.sort((a, b) => a.price - b.price);
    else if (sort === "price-desc") list.sort((a, b) => b.price - a.price);
    else if (sort === "watt-desc") list.sort((a, b) => b.wattage - a.wattage);
    return list;
  }, [query, cat, mat, volt, sort]);

  const cartTotal = useMemo(() =>
    cart.reduce((s, i) => s + i.price * i.qty, 0), [cart]
  );

  function addToCart(p) {
    setCart(prev => {
      const ex = prev.find(i => i.id === p.id);
      if (ex) return prev.map(i => i.id === p.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { id: p.id, name: p.name, price: p.price, qty: 1 }];
    });
  }

  function submitContact() {
    if (!contact.name || !contact.phone || !contact.message) {
      alert("Please fill Name, Phone, and Message.");
      return;
    }
    const text = encodeURIComponent(
      `Inquiry from ${contact.name}\nPhone: ${contact.phone}\nEmail: ${contact.email || '-'}\n\n${contact.message}`
    );
    const whatsappNumber = "918595432960";
    if (typeof window !== "undefined") {
      window.open(`https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${text}`, "_blank");
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white text-slate-900">
      <h1 className="text-3xl font-bold text-center p-6">Priyadarshi Heaters</h1>

      {/* Example product grid */}
      <div className="grid grid-cols-2 gap-4 p-6">
        {filtered.map(p => (
          <Card key={p.id}>
            <CardHeader>
              <CardTitle>{p.name}</CardTitle>
              <CardDescription>{p.desc}</CardDescription>
            </CardHeader>
            <CardContent>
              <p>{inr(p.price)}</p>
            </CardContent>
            <CardFooter>
              <Button onClick={() => addToCart(p)}>
                <ShoppingCart className="h-4 w-4 mr-2" /> Add
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Contact form */}
      <div className="p-6">
        <h2 className="font-bold mb-2">Contact Us</h2>
        <Input
          placeholder="Name"
          value={contact.name}
          onChange={e => setContact({ ...contact, name: e.target.value })}
        />
        <Input
          placeholder="Phone"
          className="mt-2"
          value={contact.phone}
          onChange={e => setContact({ ...contact, phone: e.target.value })}
        />
        <Textarea
          placeholder="Message"
          className="mt-2"
          value={contact.message}
          onChange={e => setContact({ ...contact, message: e.target.value })}
        />
        <Button className="mt-2" onClick={submitContact}>
          <PhoneCall className="h-4 w-4 mr-2" /> WhatsApp
        </Button>
      </div>
    </div>
  );
}
