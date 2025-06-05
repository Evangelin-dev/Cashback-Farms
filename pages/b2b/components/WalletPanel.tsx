import { Button, Card, Col, message, Row, Statistic } from "antd";
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

  return (
    <Card
      title="Wallet / Settlement Panel"
      style={{
        borderRadius: 8,
        boxShadow: "0 1px 4px #e5e7eb",
        marginBottom: 24,
      }}
      bodyStyle={{ background: "#fff" }}
    >
      <Row gutter={16}>
        <Col span={12}>
          <Statistic title="Wallet Balance" value={balance} prefix="₹" />
        </Col>
        <Col span={12}>
          <Statistic title="Pending Settlements" value={pending} prefix="₹" />
        </Col>
      </Row>
      <Button
        type="primary"
        style={{ marginTop: 16, background: "#22c55e", borderColor: "#22c55e", color: "#fff" }}
        disabled={pending === 0}
        onClick={handleSettle}
        block
      >
        Settle Now
      </Button>
    </Card>
  );
};

export default WalletPanel;
