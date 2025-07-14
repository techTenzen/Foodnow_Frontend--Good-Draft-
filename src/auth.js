// Authentication simulation using localStorage
export class Auth {
  static setUser(user) {
    localStorage.setItem('foodnow_user', JSON.stringify(user));
  }
  
  static getUser() {
    const user = localStorage.getItem('foodnow_user');
    return user ? JSON.parse(user) : null;
  }
  
  static logout() {
    localStorage.removeItem('foodnow_user');
    window.location.href = 'index.html';
  }
  
  static isLoggedIn() {
    return this.getUser() !== null;
  }
  
  static getUserRole() {
    const user = this.getUser();
    return user ? user.role : null;
  }
  
  static login(email, password, role = 'customer') {
    // Simulate login - in real app, this would be an API call
    const user = {
      id: Date.now(),
      email,
      role,
      name: email.split('@')[0],
      phone: '+91 9876543210',
      avatar: `https://ui-avatars.com/api/?name=${email.split('@')[0]}&background=FF6B00&color=fff`
    };
    
    this.setUser(user);
    return user;
  }
}

// Initialize user state
window.Auth = Auth;