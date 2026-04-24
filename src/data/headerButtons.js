import React from 'react';
import { 
  Users, 
  Truck, 
  MapPin, 
  Package, 
  CreditCard, 
  Phone, 
  FileText 
} from 'lucide-react';


export const headerButtons = [
  {
    id: 1,
    title: "Clients",
    icon: <Users size={20} />,
    pageKey: "clients"
  },
  {
    id: 2,
    title: "Vehicles",
    icon: <Truck size={20} />,
    pageKey: "vehicles"
  },
  {
    id: 3,
    title: "Geo Fence",
    icon: <MapPin size={20} />,
    pageKey: "geoFence"
  },
  {
    id: 4,
    title: "Inventory",
    icon: <Package size={20} />,
    pageKey: "inventory"
  },
  {
    id: 5,
    title: "Accounts",
    icon: <CreditCard size={20} />,
    pageKey: "accounts"
  },
  {
    id: 6,
    title: "RoboCall",
    icon: <Phone size={20} />,
    pageKey: "roboCall"
  },
  {
    id: 7,
    title: "Reports",
    icon: <FileText size={20} />,
    pageKey: "reports"
  }
];