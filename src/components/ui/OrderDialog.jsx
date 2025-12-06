"use client";
import React, { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronRight } from "lucide-react";

export default function OrderDialog({ onSubmit, disabled }){
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ custName: "", phone: "", company: "", email: "", address: "", city: "", state: "", pincode: "", gst: "", notes: "", delivery: "Standard (Surface)", payment: "Advance 50%" });
  
  function handleSubmit(){ 
    onSubmit(form); 
    setOpen(false); 
  }

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
            <div><Label>City</Label><Input value={form.city} onChange={e=>setForm({...form, city:e.target.value})} /></div>
            <div><Label>State</Label><Input value={form.state} onChange={e=>setForm({...form, state:e.target.value})} /></div>
            <div><Label>Pincode</Label><Input value={form.pincode} onChange={e=>setForm({...form, pincode:e.target.value})} /></div>
          </div>
          <div className="grid sm:grid-cols-3 gap-3">
            <div><Label>GSTIN</Label><Input value={form.gst} onChange={e=>setForm({...form, gst:e.target.value})} placeholder="If applicable"/></div>
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
            <Textarea rows={3} value={form.notes} onChange={e=>setForm({...form, notes:e.target.value})} placeholder="Any special requirements..."/>
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