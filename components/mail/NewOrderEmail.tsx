import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface NewOrderEmailProps {
  orderId: string;
  orderCode: string;
  customerName: string;
  orderDate: string;
  totalAmount: string;
  orderItems: {
    name: string;
    quantity: number;
    price: string;
  }[];
  adminDashboardUrl?: string;
}

export const NewOrderEmail = ({
  orderCode,
  orderId,
  customerName,
  orderDate,
  totalAmount,
  orderItems,
  adminDashboardUrl = `https://primsrv.com/admin/orders/${orderId}`,
}: NewOrderEmailProps) => (
  <Html>
    <Head />
    <Preview>New Order Received - #{orderCode}</Preview>
    <Body className="bg-gray-50 font-sans">
      <Container className="bg-white mx-auto my-8 p-8 rounded-lg shadow-sm max-w-2xl">
        <Img
          src="https://primsrv.com/imgs/logo.png"
          width="120"
          height="40"
          alt="Your E-commerce"
          className="mx-auto"
        />
        
        <Text className="text-2xl font-semibold text-gray-800 text-center mt-6 mb-4">
          New Order Received
        </Text>
        
        <Text className="text-gray-600 mb-6">
          Hello Admin,
        </Text>
        
        <Text className="text-gray-600 mb-6">
          A new order has been placed by {customerName}. Here are the details:
        </Text>

        <div className="grid grid-cols-2 gap-2 mb-6">
          <div className="font-medium text-gray-800">Order ID:</div>
          <div className="text-gray-600">#{orderCode}</div>
          
          <div className="font-medium text-gray-800">Order Date:</div>
          <div className="text-gray-600">{orderDate}</div>
          
          <div className="font-medium text-gray-800">Customer:</div>
          <div className="text-gray-600">{customerName}</div>
        </div>

        {/* Improved Table Styling */}
        <div className="mb-6">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 px-4 font-semibold text-gray-800">Item</th>
                <th className="text-center py-2 px-4 font-semibold text-gray-800">Qty</th>
                <th className="text-right py-2 px-4 font-semibold text-gray-800">Price</th>
              </tr>
            </thead>
            <tbody>
              {orderItems.map((item, index) => (
                <tr key={index} className="border-b border-gray-100">
                  <td className="py-3 px-4 text-gray-700">{item.name}</td>
                  <td className="py-3 px-4 text-center text-gray-700">{item.quantity}</td>
                  <td className="py-3 px-4 text-right text-gray-700">{item.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end items-center mb-6">
          <div className="font-semibold text-gray-800 mr-4">Total Amount:</div>
          <div className="text-xl font-semibold text-gray-800">{totalAmount}</div>
        </div>

        <Hr className="border-gray-200 my-6" />

        <div className="text-center">
          <Button
            href={adminDashboardUrl}
            className="bg-blue-600 text-white font-medium py-3 px-6 rounded-md hover:bg-blue-700"
          >
            View Order in Dashboard
          </Button>
        </div>

        <Text className="text-gray-500 text-xs text-center mt-8">
          You're receiving this email because you're an administrator of the e-commerce site.
        </Text>
      </Container>
    </Body>
  </Html>
);