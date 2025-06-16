import React from "react";
import HostHeader from "../HostHeader";

const Message = () => {
  const users = [
    {
      id: 1234,
      name: "User 1234",
      message: "Hello, I'm interested in booking your property for a week in July.",
      avatar:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuDbGnbhlEt8YXx3LVVM7Qysy0gZLKiQ1amlSaxzpxQwnHxnUJ58MGOUsPVfIw7f4NmRkV_9yvf7GjeDcZnNkj7remlOzEk34zBWYpk8_F9-_FzLemoJ-LD0sYx1uXMTzypMDDvcnbrVJBp52h5TboAN0ICxcRg0AnM6kF5mBOqK3cD6y9ed7bw9qU-YDCPS92T9AFdCYxDHhGLO4i_TIO4AhwPGqJ9uyqpILaX24lujG8F2Z7IBSZTGmKg6F_FcgCKKPcQH0-dz4Xk",
    },
    {
      id: 5678,
      name: "User 5678",
      message: "Is your property pet-friendly?",
      avatar:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuAmjJPqeVJCVxV6DNin1GzkKD3T-119U_j8tlMLnHKHn3xxNxMEqJYSBQBMmJFyAtlmPdzE_32Sg5wE63LRFCHUCH9F_eXY1xT_Vo-K-5Gf8AoIbl1lzTtKWnSy3NNS0zn2M4y4zlYj2B-Z-8gBmaCFEbvrD3c-Rb8J8Er9pi2vlj8XI7rmVaGKv_a5RXQIVjy2Y_MapVH0lw-1jYZ5pUa-xAavTQA5iNngSU_btruBFu0NJy7C_ML1tq_NMNiGz5Z-CO0wCuMpXFo",
    },
    {
      id: 9101,
      name: "User 9101",
      message: "I have a question about the amenities listed.",
      avatar:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuAQjIFgJCNGc-UDqlj70h4CT0yaX_jiCzOI_MMoiXPMb62XfICjOfQdgrupYdzbZEYmi_999WtoNoD5g4Pov0BxpnDbu0KmeTGxMBbFlp1nHrrenBijGAPtUD90ULcl8EfAt6uZbMEUyGMBonLn4kLAC4Qscc0ubRbCCx45ZXl8pZTHyMUL8wvzO0VNbVhRuv8K2AxY3IQozo7Le-HMEket0JXB_WJwW00-GB4PwU_MS4zIxOB3DPLIJlnpzjEzINUlcT6LnAbBIW0",
    },
  ];

  return (
    <div className="relative flex min-h-screen flex-col bg-white font-['Plus Jakarta Sans','Noto Sans',sans-serif] overflow-hidden">
      <HostHeader />

      <div className="flex flex-1  gap-1 px-6 py-5">
        {/* Sidebar */}
        <div className="flex flex-col w-80 border-r border-gray-200 overflow-y-auto">
          <h2 className="text-[22px] font-bold px-4 pt-5 pb-3 text-[#111418]">Chats</h2>
          {users.map((user) => (
            <div
              key={user.id}
              className="flex gap-4 items-center px-4 py-3  hover:bg-gray-50 cursor-pointer transition"
            >
              <div
                className="bg-center bg-cover rounded-full h-14 w-14"
                style={{ backgroundImage: `url(${user.avatar})` }}
              />
              <div className="flex flex-col">
                <p className="text-base font-semibold text-[#111418] truncate">{user.name}</p>
                <p className="text-sm text-[#60758a] line-clamp-2">{user.message}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Chat View */}
        <div className="flex flex-col flex-1 ml-60 max-w-[960px]">
          {/* Header */}
          <div className="sticky mb-9 bg-white z-10 border-b border-gray-200 p-4">
            <p className="text-[28px] font-bold text-[#111418]">Conversation with User 1234</p>
          </div>

          {/* Messages */}
          <div className="flex flex-col gap-4 p-4 overflow-y-auto flex-1">
            <div className="flex items-end gap-3">
              <div
                className="w-10 h-10 bg-center bg-cover rounded-full shrink-0"
                style={{
                  backgroundImage:
                    'url("https://lh3.googleusercontent.com/aida-public/AB6AXuA62Cd-RXd4Sao4hXOURY_hDgMZOp8IklPdIv24i9rNgndOOfBi6iggph2g6qpB5E0OW9ymJIQWxrx8koyeXxONUIAPmboHr-QWSHpSp7HWXxdK1MKQOCHQllH8XayUAsINK1ohujYZOZJqeu8kgI9q-81HKKTclI0XWaEZ55jHP2WO2x0lOSlI8kZeSVJBHfgIU8O9MejjadlxNoAZHLijv-nyJjRo47ggbQiMhdYh9-3q4QCzUuvqYrUODZSyBcExyzJhuySVfXw")',
                }}
              />
              <div className="flex flex-col gap-1 items-start">
                <p className="text-sm text-[#60758a]">User 1234</p>
                <div className="bg-gray-100 text-[#111418] px-4 py-3 rounded-2xl max-w-[360px] shadow-sm">
                  Hello, I'm interested in booking your property for a week in July.
                </div>
              </div>
            </div>

            <div className="flex items-end gap-3 justify-end">
              <div className="flex flex-col gap-1 items-end">
                <p className="text-sm text-[#60758a]">You</p>
                <div className="bg-[#0c7ff2] text-white px-4 py-3 rounded-2xl max-w-[360px] shadow-md">
                  Hi there! I'd be happy to help you with that. Could you please provide the exact...
                </div>
              </div>
            </div>
          </div>

          {/* Message Input */}
          <div className=" p-4 flex gap-3">
            <input
              type="text"
              placeholder="Type your message..."
              className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition">
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Message;
