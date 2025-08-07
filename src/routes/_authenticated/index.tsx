import { createFileRoute } from "@tanstack/react-router";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export const Route = createFileRoute("/_authenticated/")({
  // loader: async ({ context: { queryClient } }) => {
  //   await queryClient.prefetchQuery(youtubeAuthorizationDataQueryOptions);
  // },
  component: Home,
});

function Home() {
  return <p>Home</p>;
}

interface PreChartData {
  type: string;
  baseSalary: number; // per hour at 40 hours per week
  cashBonus: number;
  equityBonus: number;
  equityPayoutAmortized: number; // $500k/y
  likeliness: number; // 1 to 10
  // benefits: number;
  // raise // matches inflation
  // afterTaxIncome
}

// Questions
// 1.

const preChartData: PreChartData[] = [
  {
    type: "MaC",
    baseSalary: 150000,
    cashBonus: 0,
    equityBonus: 0,
    equityPayoutAmortized: 25000, // 5% equity
    likeliness: 3,
  },
  {
    type: "MaE",
    baseSalary: 100000,
    cashBonus: 0,
    equityBonus: 0,
    equityPayoutAmortized: 75000, // 15% equity
    likeliness: 8,
  },
  {
    type: "MiCGE",
    baseSalary: 100000,
    cashBonus: 20000,
    equityBonus: 0,
    equityPayoutAmortized: 37500, // 7.5% equity
    likeliness: 6,
  },
  {
    type: "GCGE",
    baseSalary: 130000,
    cashBonus: 20000,
    equityBonus: 0,
    equityPayoutAmortized: 25000, // 5% equity
    likeliness: 4,
  },
  {
    type: "GCGE",
    baseSalary: 120000,
    cashBonus: 20000,
    equityBonus: 0,
    equityPayoutAmortized: 37500, // 7.5% equity
    likeliness: 5,
  },
  {
    type: "BAL",
    baseSalary: 115000,
    cashBonus: 25000,
    equityBonus: 0,
    equityPayoutAmortized: 37500, // 7.5% equity
    likeliness: 5,
  },
  {
    type: "MiCGE",
    baseSalary: 100000,
    cashBonus: 20000,
    equityBonus: 0,
    equityPayoutAmortized: 62500, // 12.5% equity
    likeliness: 7,
  },
];

type ChartData = {
  type: string;
};

const chartData = preChartData.map(
  ({
    baseSalary,
    cashBonus,
    equityBonus,
    equityPayoutAmortized,
    likeliness,
    type,
  }) => ({
    type,
    baseSalary,
    cashBonus,
    equityPayoutAmortized,
    totalCompensation: baseSalary + cashBonus + equityPayoutAmortized,
  }),
);

const chartConfig = {
  cash: {
    label: "Cash",
    color: "var(--chart-1)",
  },
  bonus: {
    label: "Bonus",
    color: "var(--chart-2)",
  },
  equity: {
    label: "Equity",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig;

function Chart() {
  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
      <Card>
        <CardHeader>
          {/* <CardTitle>Bar Chart - Stacked + Legend</CardTitle> */}
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig}>
            <BarChart accessibilityLayer data={chartData}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="type"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value.slice(0, 6)}
              />
              <YAxis
                dataKey="totalCompensation"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value}
              />
              <ChartTooltip content={<ChartTooltipContent hideLabel />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Bar
                dataKey="baseSalary"
                stackId="a"
                fill="var(--color-cash)"
                radius={[0, 0, 4, 4]}
              />
              <Bar
                dataKey="cashBonus"
                stackId="a"
                fill="var(--color-bonus)"
                radius={[0, 0, 0, 0]}
              />
              <Bar
                dataKey="equityPayoutAmortized"
                stackId="a"
                fill="var(--color-equity)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* <BarChart accessibilityLayer data={chartData}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="month"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => value.slice(0, 3)}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
        <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
      </BarChart> */}
    </ChartContainer>
  );
}
