import { Button, Card, Col, message, Progress, Row, Statistic, Tooltip } from "antd";
import React, { useState } from "react";

const WalletPanel: React.FC = () => {
  const [balance, setBalance] = useState(12500);
  const [pending, setPending] = useState(3200);

  const handleSettle = () => {
    if (pending > 0) {
      setBalance(balance + pending);
      setPending(0);
      message.success("Settlement completed!");
    }
  };

  const percent = balance + pending === 0 ? 0 : Math.round((pending / (balance + pending)) * 100);

  return (
    <div className="flex flex-row gap-8 w-full items-start">
      {/* Left: Wallet Panel */}
      <div className="flex-1 flex flex-col items-center justify-center">
        <Card
          title={
            <div className="flex items-center gap-3">
              <span className="rounded-full bg-gradient-to-br from-green-400 to-green-600 p-1 shadow-lg">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24">
                  <rect x="3" y="7" width="18" height="13" rx="3" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 3v4M8 3v4" />
                </svg>
              </span>
              <span className="text-base font-bold text-primary-light">Wallet / Settlement Panel</span>
            </div>
          }
          style={{
            borderRadius: 16,
            boxShadow: "0 2px 8px #22c55e11",
            marginBottom: 20,
            width: "100%",
            maxWidth: 420,
            background: "linear-gradient(135deg, #f0fdf4 0%, #f9fafb 100%)",
            border: "none",
          }}
          bodyStyle={{ background: "transparent", padding: 18 }}
        >
          <Row gutter={16} className="mb-4">
            <Col span={12}>
              <div className="flex flex-col items-center">
                <Statistic
                  title={
                    <span className="text-green-700 font-semibold flex items-center gap-1 text-xs">
                      <svg className="w-3 h-3 text-green-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v8M8 12h8" />
                      </svg>
                      Wallet Balance
                    </span>
                  }
                  value={balance}
                  prefix="₹"
                  valueStyle={{ color: "#059669", fontWeight: 700, fontSize: 18, letterSpacing: 0.5 }}
                />
                <span className="text-[10px] text-gray-500 mt-1">Available</span>
              </div>
            </Col>
            <Col span={12}>
              <div className="flex flex-col items-center">
                <Statistic
                  title={
                    <span className="text-yellow-700 font-semibold flex items-center gap-1 text-xs">
                      <svg className="w-3 h-3 text-yellow-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4h4" />
                      </svg>
                      Pending
                    </span>
                  }
                  value={pending}
                  prefix="₹"
                  valueStyle={{ color: "#f59e42", fontWeight: 700, fontSize: 18, letterSpacing: 0.5 }}
                />
                <span className="text-[10px] text-gray-500 mt-1">To be settled</span>
              </div>
            </Col>
          </Row>
          <div className="flex flex-col items-center mb-4 w-full">
            <Tooltip title={`Pending: ₹${pending} / Total: ₹${balance + pending}`}>
              <Progress
                percent={percent}
                showInfo={false}
                strokeColor={{
                  "0%": "#f59e42",
                  "100%": "#22c55e"
                }}
                trailColor="#e5e7eb"
                style={{ width: "95%" }}
                strokeWidth={8}
              />
            </Tooltip>
            <div className="flex justify-between w-full text-[10px] text-gray-500 mt-1 px-2">
              <span className="font-semibold text-green-700">Wallet</span>
              <span className="font-semibold text-yellow-700">Pending</span>
            </div>
          </div>
          <Button
            type="primary"
            style={{
              marginTop: 8,
              background: pending > 0 ? "linear-gradient(90deg,#22c55e,#16a34a)" : "#d1fae5",
              borderColor: "#22c55e",
              color: pending > 0 ? "#fff" : "#6b7280",
              fontWeight: 700,
              fontSize: 13,
              boxShadow: pending > 0 ? "0 2px 8px #22c55e33" : undefined,
              transition: "all 0.2s",
              borderRadius: 8,
              letterSpacing: 0.5,
            }}
            disabled={pending === 0}
            onClick={handleSettle}
            block
          >
            {pending > 0 ? (
              <span className="flex items-center justify-center gap-1 text-xs">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a5 5 0 00-10 0v2M5 12h14M7 12v6a2 2 0 002 2h6a2 2 0 002-2v-6" />
                </svg>
                Settle Now
              </span>
            ) : (
              <span className="flex items-center justify-center gap-1 text-xs">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v8M8 12h8" />
                </svg>
                No Pending
              </span>
            )}
          </Button>
          <div className="flex justify-center mt-4">
            <div className="rounded-xl bg-gradient-to-r from-green-100 via-white to-yellow-100 px-3 py-2 flex items-center gap-2 shadow-inner border border-green-200">
              <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v8M8 12h8" />
              </svg>
              <span className="text-xs text-gray-700 font-semibold">
                Instant settlements. For help: <a href="mailto:support@b2b.com" className="text-primary underline">support@b2b.com</a>
              </span>
            </div>
          </div>
        </Card>
      </div>
      {/* Right: Ad Content */}
      <div className="w-[18rem] flex-shrink-0 flex flex-col items-center">
        <Card
          style={{
            borderRadius: 16,
            boxShadow: "0 2px 8px #22c55e11",
            width: "100%",
            background: "linear-gradient(135deg, #f0fdf4 0%, #f9fafb 100%)",
            border: "none",
            padding: 0,
          }}
          bodyStyle={{ background: "transparent", padding: 16 }}
        >
          <div className="flex flex-col items-center">
            <img
              src="https://img.freepik.com/free-vector/real-estate-sale-banner-template_23-2148686847.jpg?w=826"
              alt="Ad Banner"
              className="rounded-xl mb-3 shadow-md object-cover"
              style={{ width: "100%", maxHeight: 100 }}
            />
            <div className="text-base font-bold text-primary mb-1 text-center">Special Offer!</div>
            <div className="text-xs text-gray-700 mb-2 text-center">
              Get <span className="text-primary font-semibold">10% cashback</span> on your next order.<br />
              Limited time only.
            </div>
            <button
              className="mt-1 px-4 py-1 bg-primary text-white rounded-lg font-semibold shadow hover:bg-primary-dark transition text-xs"
              onClick={() => window.open("https://your-offer-link.com", "_blank")}
            >
              Grab Offer
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default WalletPanel;
