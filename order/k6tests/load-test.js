import http from "k6/http";
import { sleep } from "k6";

export const options = {
  scenarios: {
    steady_load: {
      executor: "constant-arrival-rate",
      rate: 10, // 10 requisições por segundo
      timeUnit: "1s", // Definindo o intervalo para a taxa de requisição
      duration: "5m", // Duração total do teste
      preAllocatedVUs: 5000, // Aloca 5000 usuários
      maxVUs: 5000, // Limite de até 5000 usuários simultâneos
    },
  },
  http_req_failed: ["rate<0.01"],
  http_req_duration: ["p(95)<200"],
};

export default function () {
  const payload = JSON.stringify({
    customer_id: "4e367fc0-d5af-4b10-b140-75a97f03fc26",
    product_name: "Test Product",
    amount: 2,
  });
  const params = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  let res = http.post("http://localhost:3001/orders", payload, params);
  sleep(1);
}
