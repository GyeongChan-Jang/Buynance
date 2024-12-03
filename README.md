# Buynance

![good](https://github.com/user-attachments/assets/0ebb79db-d361-433b-88e0-88fe84f9f3ea)

## **What I Learned**

- I learned how to use and integrate **Binance API** data into a project, particularly focusing on implementing **real-time data communication** using **WebSocket**. This helped me gain a deeper understanding of real-time data handling in web applications.
- I realized that visualizing **financial data** on a chart is more complex than working with standard charts. It required a significant amount of domain-specific knowledge in finance, and I was able to acquire and apply that knowledge effectively.
- I had the opportunity to explore **OrderBook** in depth. I gained a detailed understanding of how bid and ask orders accumulate, and how prices are determined and executed based on these orders during the development process.

---

## **Challenges and How I Overcame Them**

### **1. Compatibility Issues with Next.js 15**

Next.js 15 uses **React 19**, but many libraries are not yet compatible with this version, which led to compatibility issues.

- Most libraries did not support React 19, so I used `npm install --legacy-peer-deps` to bypass **peerDependencies conflicts** during installation.
- This issue became particularly problematic when using **Recoil**.
  - Errors occurred consistently when creating an `atom` and wrapping components with `RecoilRoot`. After some research, I discovered that the Recoil library had not been actively maintained for a long time.
  - I found similar issues discussed on Reddit, and based on the information, I concluded that **Recoil is not compatible with React 19** and Next.js 15.
- Instead of installing another state management library, I opted to use **React's built-in Context API** to manage global state, which resolved the dependency issue.

### **2. WebSocket Issues with Binance Connector for TypeScript**

The [binance-connector-typescript](https://github.com/binance/binance-connector-typescript) library encountered errors when using WebSocket in a browser environment.

- To resolve this, I implemented the WebSocket communication manually using the **native WebSocket object** in JavaScript, which ensured stable real-time data transmission.

### **3. Implementing a Responsive Chart**

I faced challenges when trying to implement a **responsive chart** that adjusted its size based on the screen resolution. Like many chart libraries, it did not automatically adapt to different screen sizes in a seamless manner.

- I solved this by using **ResizeObserver** to monitor changes in the size of the chart container.
- By manipulating the container's `ref` and dynamically updating the `height` value, I was able to achieve a fully responsive chart layout that adjusted smoothly to different screen sizes.
