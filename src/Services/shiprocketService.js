const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function checkDelivery(pincode) {
  console.log("📦 [checkDelivery] called with:", pincode);

  try {
    const res = await fetch(`${BASE_URL}/shiprocket/check/${pincode}`);
    console.log("📦 [checkDelivery] response status:", res.status);

    const data = await res.json();
    console.log("📦 [checkDelivery] response data:", data);

    if (!res.ok) {
      throw new Error("Failed to check delivery");
    }

    return data;
  } catch (error) {
    console.error("❌ [checkDelivery] error:", error);
    return { success: false, message: error.message };
  }
}

// ✅ Track AWB
// export async function trackAWB(awb, token) {
//   try {
//     const res = await fetch(`${BASE_URL}/shiprocket/track/${awb}`, {
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json",
//         ...(token ? { Authorization: `Bearer ${token}` } : {}),
//       },
//       credentials: "include", 
//     });

//     const text = await res.text();
//     let json;
//     try {
//       json = JSON.parse(text);
//     } catch {
//       json = { success: res.ok, rawText: text };
//     }

//     if (!res.ok) {
//       return {
//         success: false,
//         message: json?.message || text || "Failed to fetch tracking",
//       };
//     }

//     // success
//     return { success: true, ...json };
//   } catch (err) {
//     console.error("trackAWB error:", err);
//     return { success: false, message: err.message || "Track failed" };
//   }
// }

// Aks
export async function trackAWB(awb, token) {
  console.log("🚚 [trackAWB] called with:", { awb, token });

  try {
    const res = await fetch(`${BASE_URL}/shiprocket/track/${awb}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      credentials: "include",
    });

    console.log("🚚 [trackAWB] response status:", res.status);

    const text = await res.text();
    console.log("🚚 [trackAWB] raw response text:", text);

    let json;
    try {
      json = JSON.parse(text);
      console.log("🚚 [trackAWB] parsed JSON:", json);
    } catch {
      console.warn("⚠️ [trackAWB] not JSON response");
      json = { success: res.ok, rawText: text };
    }

    if (!res.ok) {
      console.error("❌ [trackAWB] failed response:", json);
      return {
        success: false,
        message: json?.message || text || "Failed to fetch tracking",
      };
    }

    console.log("✅ [trackAWB] success response:", json);
    return { success: true, ...json };

  } catch (err) {
    console.error("❌ [trackAWB] error:", err);
    return { success: false, message: err.message || "Track failed" };
  }
}

export async function createOrder(orderData) {
  try {
    const res = await fetch(`${BASE_URL}/shiprocket/create-order`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderData),
    });

    if (!res.ok) {
      throw new Error("Failed to create order");
    }
    return await res.json();
  } catch (error) {
    console.error("Error creating order:", error);
    return { success: false, message: error.message };
  }
}
