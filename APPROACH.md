# APPROACH.md – My Development Approach

## 1. Project Understanding

Sabse pehle maine Cantill.ai challenge ko understand kiya. Iska main purpose purchase requests ko automatically process karna aur procurement workflow ko simple banana tha.

Maine project ko do main parts mein divide kiya:

- Employee Panel
- Admin Panel

## 2. Technology Selection

Maine MERN Stack choose kiya:

- React.js for frontend
- Node.js and Express.js for backend
- MongoDB for database
- Mongoose for database operations

Frontend aur backend ko REST APIs ke through connect kiya.

## 3. Backend Development

Sabse pehle backend setup kiya aur MongoDB connection establish kiya.

Uske baad maine:
- User authentication implement ki.
- JWT ke through protected routes banaye.
- Employee aur Admin ke liye role-based access implement kiya.
- Purchase Request, Purchase Order, Decision, Policy aur Sourcing ke models banaye.
- Controllers aur routes create kiye.

## 4. Frontend Development

React mein frontend develop kiya.

Maine reusable components aur separate pages ka use kiya.

Employee ke liye registration, login, dashboard, AI Chat, My Requests aur My Orders banaye.

Admin ke liye dashboard, all requests, approvals, purchase orders, sourcing, policies, decisions aur CSV upload pages banaye.

Axios ke through backend APIs connect ki.

## 5. AI Integration

AI integration ka purpose employee ke natural language messages se purchase-related information extract karna tha.

Extracted information ko backend par validate karke Purchase Request create karne ke liye use kiya.

## 6. Procurement Policy Engine

Maine policy-based evaluation implement ki.

System active policy ke rules check karta hai aur request ke outcome ke according:

- Purchase Order create karta hai.
- Sourcing Request create karta hai.
- Admin approval ke liye request bhejta hai.
- Required information missing hone par request ko needs_info status deta hai.

## 7. CSV Upload

Maine Multer ka use karke CSV file upload functionality implement ki.

CSV data parse aur validate hone ke baad har row ko Purchase Request mein convert kiya jata hai.

Har request ko active procurement policy ke according evaluate kiya jata hai.

## 8. Testing Approach

Maine development ke dauran frontend aur backend APIs ko connect karke test kiya.

CSV upload test mein:
- Keyboard – Purchase Order
- Mouse – Purchase Order
- Laptop – Needs Approval

Isse CSV processing aur basic policy evaluation verify ki.

Authentication, request creation, approval, rejection aur dashboard functionality ko bhi test karna zaroori hai.

## 9. Future Improvements

Aage main supplier matching, contract validation, request consolidation, policy amendment workflow aur detailed audit logging jaise features improve karna chahta hoon.

## Conclusion

Mera approach project ko modules mein divide karke step-by-step develop karna tha. Isse frontend, backend, authentication aur procurement workflow ko separately manage karna easy hua.