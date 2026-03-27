import React, { createContext, useContext, useState, useCallback } from "react";
import { trackAWB as trackAWBService } from "../Services/shiprocketService.js";
import { useAuth } from "./AuthContext.jsx";

const TrackingContext = createContext();

export const useTracking = () => useContext(TrackingContext);

export const TrackingProvider = ({ children }) => {
  const { token } = useAuth();
  const [trackingData, setTrackingData] = useState(null);
  const [trackingLoading, setTrackingLoading] = useState(false);
  const [trackingError, setTrackingError] = useState(null);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerMeta, setDrawerMeta] = useState(null);

  const normalizeTimeline = (raw) => {
    if (!raw) return [];
    let events = [];
    if (Array.isArray(raw)) events = raw;
    else if (Array.isArray(raw?.tracking_details))
      events = raw.tracking_details;
    else if (Array.isArray(raw?.courier_tracking_details))
      events = raw.courier_tracking_details;
    else if (Array.isArray(raw?.data)) events = raw.data;
    else if (Array.isArray(raw?.response?.data)) events = raw.response.data;
    else if (Array.isArray(raw?.tracking)) events = raw.tracking;
    else events = [];

    return events.map((ev) => ({
      time:
        ev?.date ||
        ev?.time ||
        ev?.datetime ||
        ev?.timestamp ||
        ev?.created_at ||
        null,
      title:
        ev?.status ||
        ev?.title ||
        ev?.event ||
        ev?.remark ||
        ev?.message ||
        ev?.status_description ||
        "Update",
      detail:
        ev?.description || ev?.detail || ev?.remarks || ev?.location || "",
      raw: ev,
    }));
  };

  /**
   * fetchTracking - uses the service layer
   * Accepts object { awb, shipmentId, orderId, openDrawer, meta }
   * Prefer AWB first. If you want to fetch by orderId you'll need backend support (service currently expects AWB).
   */
  // const fetchTracking = useCallback(
  //   async ({
  //     awb = null,
  //     shipmentId = null,
  //     orderId = null,
  //     openDrawer = false,
  //     meta = null,
  //   }) => {
  //     // prefer awb (service.trackAWB uses AWB). If you want to support orderId -> create a service function for it.
  //     const identifier = awb || shipmentId || orderId;
  //     if (!identifier) {
  //       const msg = "No tracking identifier provided";
  //       setTrackingError(msg);
  //       return { success: false, message: msg };
  //     }

  //     try {
  //       setTrackingLoading(true);
  //       setTrackingError(null);
  //       setTrackingData(null);

  //       // If you have AWB -> call trackAWBService(awb)
  //       // If you only have orderId but server supports track by order id, create trackByOrderId service and call it
  //       let res;
  //       if (awb) {
  //         res = await trackAWBService(awb, token); // service returns { success: true, ... } or { success: false, message }
  //       } else {
  //         // fallback: attempt to call trackAWBService with shipmentId or orderId as AWB (best-effort)
  //         res = await trackAWBService(shipmentId || orderId, token);
  //       }

  //       if (!res || !res.success) {
  //         const msg = res?.message || "No tracking data";
  //         setTrackingError(msg);
  //         setTrackingLoading(false);
  //         return { success: false, message: msg, raw: res };
  //       }

  //       // Try to extract the raw events from returned payload
  //       const raw = res.tracking || res.data || res.raw || res.response || res;
  //       const timeline = normalizeTimeline(raw);

  //       setTrackingData({
  //         awb: res.awb || awb || null,
  //         timeline,
  //         raw: res,
  //       });

  //       if (openDrawer) {
  //         setDrawerMeta(meta || null);
  //         setDrawerOpen(true);
  //       }

  //       setTrackingLoading(false);
  //       return { success: true, timeline, raw: res };
  //     } catch (err) {
  //       console.error("fetchTracking error:", err);
  //       setTrackingError(err.message || "Failed to fetch tracking");
  //       setTrackingLoading(false);
  //       return { success: false, message: err.message || "Failed" };
  //     }
  //   },
  //   [token]
  // );
  // Accept either an order object OR AWB string

  // const openDrawerForOrder = useCallback(
  //   async (orderOrStringOrAwb, opts = { meta: null }) => {
  //     if (!orderOrStringOrAwb) {
  //       setTrackingError("No order provided");
  //       return { success: false, message: "No order provided" };
  //     }

  //     let awb = null;
  //     let shipmentId = null;
  //     let orderId = null;
  //     let meta = opts.meta || null;

  //     if (typeof orderOrStringOrAwb === "string") {
  //       // treat as AWB (most common)
  //       awb = orderOrStringOrAwb;
  //     } else if (typeof orderOrStringOrAwb === "object") {
  //       const o = orderOrStringOrAwb;
  //       // common fields
  //       awb = o.awbNumber || o.trackingId || null;
  //       shipmentId = o.shiprocketShipmentId || null;
  //       orderId = o._id || null;
  //       meta = meta || {
  //         title: o.cartItems?.[0]?.product?.title || "Order",
  //         price: o.finalAmount || o.totalAmount || null,
  //       };
  //     }

  //     return fetchTracking({
  //       awb,
  //       shipmentId,
  //       orderId,
  //       openDrawer: true,
  //       meta,
  //     });
  //   },
  //   [fetchTracking]
  // );








  
  // Aks
  
//   const fetchTracking = useCallback(async (params) => {
//   console.log("🧠 [fetchTracking] called with:", params);

//   const { awb, shipmentId, orderId } = params;
//   const identifier = awb || shipmentId || orderId;

//   console.log("🧠 [fetchTracking] identifier:", identifier);

//   if (!identifier) {
//     console.error("❌ [fetchTracking] no identifier");
//     return { success: false };
//   }

//   try {
//     setTrackingLoading(true);
//     console.log("⏳ [fetchTracking] loading started");

//     let res;

//     if (awb) {
//       console.log("📡 [fetchTracking] calling trackAWBService with AWB:", awb);
//       res = await trackAWBService(awb, token);
//     } else {
//       console.log("📡 [fetchTracking] fallback call:", shipmentId || orderId);
//       res = await trackAWBService(shipmentId || orderId, token);
//     }

//     console.log("📡 [fetchTracking] service response:", res);

//     if (!res || !res.success) {
//       console.error("❌ [fetchTracking] failed:", res);
//       setTrackingLoading(false);
//       return res;
//     }

//     const raw = res.tracking || res.data || res.raw || res.response || res;
//     console.log("📊 [fetchTracking] extracted raw:", raw);

//     const timeline = normalizeTimeline(raw);
//     console.log("📊 [fetchTracking] normalized timeline:", timeline);

//     setTrackingData({
//       awb: res.awb || awb,
//       timeline,
//       raw: res,
//     });

//     console.log("✅ [fetchTracking] state updated");

//     setTrackingLoading(false);
//     return { success: true, timeline };

//   } catch (err) {
//     console.error("❌ [fetchTracking] error:", err);
//     setTrackingLoading(false);
//     return { success: false };
//   }
// }, [token]);
  
  

//   const openDrawerForOrder = useCallback(async (order) => {
//   console.log("📂 [openDrawerForOrder] input:", order);

//   let awb = order?.awbNumber || order?.trackingId;
//   let shipmentId = order?.shiprocketShipmentId;
//   let orderId = order?._id;

//   console.log("📂 [openDrawerForOrder] extracted:", {
//     awb,
//     shipmentId,
//     orderId,
//   });

//   return fetchTracking({
//     awb,
//     shipmentId,
//     orderId,
//     openDrawer: true,
//   });
// }, [fetchTracking]);









const fetchTracking = useCallback(
  async ({
    awb = null,
    shipmentId = null,
    orderId = null,
    openDrawer = false,
    meta = null,
  }) => {
    console.log("🚀 [fetchTracking] called with:", {
      awb,
      shipmentId,
      orderId,
      openDrawer,
      meta,
    });

    const identifier = awb || shipmentId || orderId;

    if (!identifier) {
      const msg = "No tracking identifier provided";
      console.log("❌ No identifier found");
      setTrackingError(msg);
      return { success: false, message: msg };
    }

    console.log("🔑 Using identifier:", identifier);

    try {
      console.log("⏳ Starting tracking request...");

      setTrackingLoading(true);
      setTrackingError(null);
      setTrackingData(null);

      let res;

      if (awb) {
        console.log("📦 Calling trackAWBService with AWB:", awb);
        res = await trackAWBService(awb, token);
      } else {
        console.log(
          "📦 No AWB, fallback → using shipmentId/orderId:",
          shipmentId || orderId
        );
        res = await trackAWBService(shipmentId || orderId, token);
      }

      console.log("📡 Service response:", res);

      if (!res || !res.success) {
        const msg = res?.message || "No tracking data";
        console.log("❌ Tracking failed:", msg);
        setTrackingError(msg);
        setTrackingLoading(false);
        return { success: false, message: msg, raw: res };
      }

      // Extract raw tracking payload
      const raw =
        res.tracking || res.data || res.raw || res.response || res;

      console.log("📥 Raw tracking data:", raw);

      const timeline = normalizeTimeline(raw);

      console.log("🕒 Normalized timeline:", timeline);

      const finalData = {
        awb: res.awb || awb || null,
        timeline,
        raw: res,
      };

      console.log("✅ Final trackingData state:", finalData);

      setTrackingData(finalData);

      if (openDrawer) {
        console.log("🧾 Opening drawer with meta:", meta);
        setDrawerMeta(meta || null);
        setDrawerOpen(true);
      }

      setTrackingLoading(false);

      console.log("🎉 fetchTracking SUCCESS");

      return { success: true, timeline, raw: res };
    } catch (err) {
      console.error("💥 fetchTracking ERROR:", err);
      setTrackingError(err.message || "Failed to fetch tracking");
      setTrackingLoading(false);
      return { success: false, message: err.message || "Failed" };
    }
  },
  [token]
);







const openDrawerForOrder = useCallback(
  async (orderOrStringOrAwb, opts = { meta: null }) => {
    console.log("🚀 [openDrawerForOrder] called with:", {
      input: orderOrStringOrAwb,
      opts,
    });

    if (!orderOrStringOrAwb) {
      console.log("❌ No order provided");
      setTrackingError("No order provided");
      return { success: false, message: "No order provided" };
    }

    let awb = null;
    let shipmentId = null;
    let orderId = null;
    let meta = opts.meta || null;

    console.log("🔍 Initial values:", { awb, shipmentId, orderId, meta });

    if (typeof orderOrStringOrAwb === "string") {
      console.log("📦 Detected string input → treating as AWB");
      awb = orderOrStringOrAwb;
    } else if (typeof orderOrStringOrAwb === "object") {
      console.log("📦 Detected object input:", orderOrStringOrAwb);

      const o = orderOrStringOrAwb;

      // Extract fields
      awb = o.awbNumber || o.trackingId || null;
      shipmentId = o.shiprocketShipmentId || null;
      orderId = o._id || null;

      console.log("📊 Extracted identifiers:", {
        awb,
        shipmentId,
        orderId,
      });

      meta = meta || {
        title: o.cartItems?.[0]?.product?.title || "Order",
        price: o.finalAmount || o.totalAmount || null,
      };

      console.log("🧾 Prepared meta:", meta);
    }

    const payload = {
      awb,
      shipmentId,
      orderId,
      openDrawer: true,
      meta,
    };

    console.log("📡 Calling fetchTracking with payload:", payload);

    const response = await fetchTracking(payload);

    console.log("✅ fetchTracking response:", response);

    return response;
  },
  [fetchTracking]
);










  const openDrawer = (awbOrId, meta = null) => {
    // convenience wrapper - treat input as AWB string
    return fetchTracking({ awb: awbOrId, openDrawer: true, meta });
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
    setDrawerMeta(null);
    // note: keeping trackingData in state is fine, so drawer can reopen quickly
  };

  return (
    <TrackingContext.Provider
      value={{
        trackingData,
        trackingLoading,
        trackingError,
        fetchTracking,
        openDrawer,
        openDrawerForOrder,
        closeDrawer,
        drawerOpen,
        drawerMeta,
        setTrackingData,
      }}
    >
      {children}
    </TrackingContext.Provider>
  );
};
