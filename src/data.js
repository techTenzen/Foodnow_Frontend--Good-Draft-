// Mock data for the application
export const restaurants = [
  {
    id: 1,
    name: "Domino's Pizza",
    cuisine: "Pizza, Italian",
    rating: 4.3,
    deliveryTime: "25-30 mins",
    image: "https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg?auto=compress&cs=tinysrgb&w=500",
    priceForTwo: 400,
    offers: ["50% OFF up to ₹100"],
    menu: [
      {
        id: 101,
        name: "Margherita Pizza",
        description: "Classic delight with 100% real mozzarella cheese",
        price: 199,
        image: "https://images.pexels.com/photos/2762942/pexels-photo-2762942.jpeg?auto=compress&cs=tinysrgb&w=300",
        category: "Pizza"
      },
      {
        id: 102,
        name: "Pepperoni Pizza",
        description: "American classic with pepperoni & cheese",
        price: 349,
        image: "https://images.pexels.com/photos/1146760/pexels-photo-1146760.jpeg?auto=compress&cs=tinysrgb&w=300",
        category: "Pizza"
      },
      {
        id: 103,
        name: "Garlic Bread",
        description: "Freshly baked garlic bread",
        price: 99,
        image: "https://images.pexels.com/photos/4109111/pexels-photo-4109111.jpeg?auto=compress&cs=tinysrgb&w=300",
        category: "Sides"
      }
    ]
  },
  {
    id: 2,
    name: "Burger King",
    cuisine: "Burgers, Fast Food",
    rating: 4.1,
    deliveryTime: "20-25 mins",
    image: "https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=500",
    priceForTwo: 350,
    offers: ["Buy 1 Get 1 Free"],
    menu: [
      {
        id: 201,
        name: "Whopper",
        description: "Our signature flame-grilled beef burger",
        price: 189,
        image: "https://images.pexels.com/photos/553979/pexels-photo-553979.jpeg?auto=compress&cs=tinysrgb&w=300",
        category: "Burgers"
      },
      {
        id: 202,
        name: "Chicken Royale",
        description: "Crispy chicken fillet with mayo",
        price: 169,
        image: "https://images.pexels.com/photos/2271107/pexels-photo-2271107.jpeg?auto=compress&cs=tinysrgb&w=300",
        category: "Burgers"
      }
    ]
  },
  {
    id: 3,
    name: "Meghana Foods",
    cuisine: "South Indian, Biryani",
    rating: 4.5,
    deliveryTime: "35-40 mins",
    image: "https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg?auto=compress&cs=tinysrgb&w=500",
    priceForTwo: 500,
    offers: ["₹125 OFF above ₹199"],
    menu: [
      {
        id: 301,
        name: "Chicken Biryani",
        description: "Aromatic basmati rice with tender chicken",
        price: 299,
        image: "https://images.pexels.com/photos/11772142/pexels-photo-11772142.jpeg?auto=compress&cs=tinysrgb&w=300",
        category: "Biryani"
      },
      {
        id: 302,
        name: "Masala Dosa",
        description: "Crispy dosa with spiced potato filling",
        price: 149,
        image: "https://images.pexels.com/photos/5560763/pexels-photo-5560763.jpeg?auto=compress&cs=tinysrgb&w=300",
        category: "South Indian"
      }
    ]
  }
];

export const categories = [
  { id: 1, name: "Pizza", icon: "🍕", color: "bg-red-100" },
  { id: 2, name: "Burgers", icon: "🍔", color: "bg-yellow-100" },
  { id: 3, name: "South Indian", icon: "🥘", color: "bg-green-100" },
  { id: 4, name: "Chinese", icon: "🥡", color: "bg-blue-100" },
  { id: 5, name: "Desserts", icon: "🍰", color: "bg-pink-100" },
  { id: 6, name: "Beverages", icon: "🥤", color: "bg-purple-100" }
];

export const orders = [
  {
    id: 1001,
    restaurantName: "Domino's Pizza",
    items: ["Margherita Pizza", "Garlic Bread"],
    total: 298,
    status: "delivered",
    date: "2024-01-15",
    time: "2:30 PM"
  },
  {
    id: 1002,
    restaurantName: "Burger King",
    items: ["Whopper", "French Fries"],
    total: 259,
    status: "preparing",
    date: "2024-01-16",
    time: "7:45 PM"
  }
];

// Cart management
export class Cart {
  static getItems() {
    const items = localStorage.getItem('foodnow_cart');
    return items ? JSON.parse(items) : [];
  }
  
  static addItem(item, quantity = 1) {
    const items = this.getItems();
    const existingItem = items.find(i => i.id === item.id);
    
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      items.push({ ...item, quantity });
    }
    
    localStorage.setItem('foodnow_cart', JSON.stringify(items));
    this.updateCartCount();
  }
  
  static removeItem(itemId) {
    const items = this.getItems().filter(item => item.id !== itemId);
    localStorage.setItem('foodnow_cart', JSON.stringify(items));
    this.updateCartCount();
  }
  
  static updateQuantity(itemId, quantity) {
    const items = this.getItems();
    const item = items.find(i => i.id === itemId);
    if (item) {
      item.quantity = quantity;
      if (quantity <= 0) {
        this.removeItem(itemId);
        return;
      }
    }
    localStorage.setItem('foodnow_cart', JSON.stringify(items));
    this.updateCartCount();
  }
  
  static getTotal() {
    return this.getItems().reduce((total, item) => total + (item.price * item.quantity), 0);
  }
  
  static getItemCount() {
    return this.getItems().reduce((count, item) => count + item.quantity, 0);
  }
  
  static clear() {
    localStorage.removeItem('foodnow_cart');
    this.updateCartCount();
  }
  
  static updateCartCount() {
    const cartCountElements = document.querySelectorAll('.cart-count');
    const count = this.getItemCount();
    cartCountElements.forEach(el => {
      el.textContent = count;
      el.style.display = count > 0 ? 'block' : 'none';
    });
  }
}

window.Cart = Cart;