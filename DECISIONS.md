# DECISIONS.md – Technical Decisions

## 1. MERN Stack Selection

**Decision:** React, Node.js, Express.js aur MongoDB use kiya.

**Reason:** MERN Stack se frontend aur backend JavaScript mein develop karna easy hota hai. Isse complete application ko maintain karna bhi convenient hai.

## 2. JWT Authentication

**Decision:** Authentication ke liye JWT use kiya.

**Reason:** JWT ki help se protected APIs access karne aur user authentication verify karne mein help milti hai.

## 3. Role-Based Access Control

**Decision:** Employee aur Admin ke liye separate permissions rakhi.

**Reason:** Employee sirf apni requests aur orders access kar sake, jabki Admin procurement management operations perform kar sake.

## 4. MongoDB and Mongoose

**Decision:** MongoDB ko database aur Mongoose ko ODM ke roop mein use kiya.

**Reason:** Purchase Requests, Policies, Decisions aur Purchase Orders ko separate collections mein manage karna convenient hai.

## 5. Separate Models

**Decision:** PurchaseRequest, PurchaseOrder, Decision, Policy aur SourcingRequest ke separate models banaye.

**Reason:** Har module ka data separately manage hota hai aur relationships maintain karna easy hota hai.

## 6. Active Policy Evaluation

**Decision:** Request evaluation ke liye active procurement policy fetch ki.

**Reason:** System ko active policy ke rules ke according purchase request ka outcome decide karna chahiye.

## 7. Automatic Purchase Order Creation

**Decision:** Jab policy evaluation ka outcome purchase_order hota hai, tab system automatically Purchase Order create karta hai.

**Reason:** Eligible purchase requests ko manually process karne ki zarurat kam hoti hai.

## 8. Admin Approval

**Decision:** needs_approval requests ko Admin ke approval ke liye rakha.

**Reason:** Kuch purchase requests ko automatic approval dene ke bajaye manual review ki zarurat hoti hai.

## 9. CSV Upload with Multer

**Decision:** CSV file upload ke liye Multer use kiya.

**Reason:** Multer Express application mein file upload aur server-side file handling ko easy banata hai.

## 10. Axios API Services

**Decision:** Frontend API calls ko separate service files mein rakha.

**Reason:** API logic ko React components se separate rakhne se code reusable aur maintainable hota hai.

## 11. Error Handling

**Decision:** Backend APIs mein try-catch aur meaningful error responses use kiye.

**Reason:** Agar API ya database operation fail hota hai, toh application ko proper error response dena chahiye.

## 12. Future Technical Improvements

Aage main in areas par kaam karna chahta hoon:

- Advanced supplier matching
- Contract validation
- Purchase request consolidation
- Policy amendment approval and versioning
- Detailed audit logs
- More comprehensive automated testing

## Final Note

Maine technical decisions project ki current requirements, maintainability aur modular development ko dhyan mein rakhkar liye hain. Jahan procurement policy ke rules additional clarification maangte hain, wahan unhe validate karke explicitly document karna chahiye.