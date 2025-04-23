
interface PaymentRowProps {
  payment: any;
}

export const PaymentRow = ({ payment }: PaymentRowProps) => (
  <tr className="hover:bg-gray-50 transition" key={payment.id}>
    <td className="px-4 py-2">{payment.payment_date ? new Date(payment.payment_date).toLocaleDateString() : "-"}</td>
    <td className="px-4 py-2">{payment.payment_method || payment.payment_gateway || "-"}</td>
    <td className="px-4 py-2">
      {payment.total_amount !== undefined && payment.total_amount !== null ?
        "$" + Number(payment.total_amount).toFixed(2) : "-"}
    </td>
    <td className="px-4 py-2">{payment.payment_number || payment.reference_number || "-"}</td>
  </tr>
);

export default PaymentRow;
