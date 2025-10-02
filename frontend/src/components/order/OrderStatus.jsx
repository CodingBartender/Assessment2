// FR-10: Order State Tracking 

import React, { useState } from 'react';
import axiosInstance from '../../axiosConfig';
import { OrderStatusChip } from './OrderStatusChip';

export default function OrderStatusActions({ order, onUpdated }) {
  const [saving, setSaving] = useState(false);

  // Encapsulation - api call hidden
  const updateStatus = async (newStatus) => {
    const userId = sessionStorage.getItem("user_id");
    await axiosInstance.put(`/api/order-status/${order._id}/status`, { 
      status: newStatus, user_id: userId 
    });
    onUpdated && onUpdated();
  };

  return (
    <div>
      <OrderStatusChip status={order.status} />
      {order.status === "Pending" && (
        <>
          {/*State Transition Pending --> Executed/Cancelled */}
          <button onClick={() => updateStatus("Executed")} disabled={saving}>Mark Executed</button>
          <button onClick={() => updateStatus("Cancelled")} disabled={saving}>Cancel</button>
        </>
      )}
    </div>
  );
}
