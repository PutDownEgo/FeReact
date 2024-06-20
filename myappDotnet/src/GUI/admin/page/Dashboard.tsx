import { useEffect, useState } from "react";
import {
    getNumsOfOrderDaily,
    getRevenueAtCurrentMonth,
    getRevenueAtCurrentYear,
    getRevenueMonthly,
} from "../../../api/OrderApi";
import PieChartMostSoldProduct from "../components/PieChartMostSoldProduct";
import SalesChart from "../components/SalesChart";
// import SalesChartByCategory from '../components/SalesChartByCategory';
import { addDays } from "date-fns";
import { DateRangePicker } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import useCurrencyFormatter from "../../../hooks/useCurrencyFormatter";
import SalesChartByCategory from "../components/SalesChartByCategory";

export type SalesMonthlyData = {
    month: string;
    sales: number;
};

const Dashboard = () => {
    const [numsOfOrderDaily, setNumsOfOrderDaily] = useState(0);
    const [monthlyRevenue, setMonthlyRevenue] = useState<SalesMonthlyData[]>([]);
    const [currentMonthRevenue, setCurrentMonthRevenue] = useState<number>(0);
    const [currentYearRevenue, setCurrentYearRevenue] = useState<number>(0);
    const formatCurrency = useCurrencyFormatter();
    const [state, setState] = useState<
        { startDate: Date | undefined; endDate: any; key: string }[]
    >([
        {
            startDate: new Date(),
            endDate: addDays(new Date(), 7),
            key: "selection",
        },
    ]);
    const [startDateStringState, setStartDateStringState] = useState<string>(
        new Date(new Date().getFullYear(), 0, 1).toLocaleDateString("en-US", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        })
    );

    const [endDateStringState, setEndDateStringState] = useState<string>(
        new Date().toLocaleDateString("en-US", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        })
    );

    useEffect(() => {
        const startDateString =
            state[0].startDate?.toLocaleDateString("en-US", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
            }) || "";
        const endDateString =
            state[0].endDate?.toLocaleDateString("en-US", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
            }) || "";
        setStartDateStringState(startDateString);
        setEndDateStringState(endDateString);
    }, [state]);

    useEffect(() => {
        const fetchNumsOfOrderDaily = async () => {
            const response = await getNumsOfOrderDaily();
            setNumsOfOrderDaily(response.result);
        };
        fetchNumsOfOrderDaily();
    }, []);

    useEffect(() => {
        const fetchMonthlyRevenue = async () => {
            const response = await getRevenueMonthly();
            setMonthlyRevenue(response.result);
        };
        fetchMonthlyRevenue();
    }, []);

    useEffect(() => {
        const fetchCurrentMonthRevenue = async () => {
            const response = await getRevenueAtCurrentMonth();
            setCurrentMonthRevenue(response.result);
        };
        fetchCurrentMonthRevenue();
    }, []);

    useEffect(() => {
        const fetchCurrentYearRevenue = async () => {
            const response = await getRevenueAtCurrentYear();
            setCurrentYearRevenue(response.result);
        };
        fetchCurrentYearRevenue();
    }, []);

    const salesData = monthlyRevenue.map((item) => {
        return {
            month: item.month,
            sales: item.sales,
        };
    });

    return (
        <div>
            <h2 className="mb-5">Sales Chart</h2>
            <div className="row mb-3">
                <div className="col-md-4">
                    <div
                        style={{
                            backgroundColor: "#86c7f3",
                            width: "100%",
                            height: "100px",
                            borderRadius: "10px",
                            padding: "15px",
                        }}
                    >
                        <h4 style={{ color: "white" }}>Number of order today</h4>
                        <p style={{ color: "white" }}>{numsOfOrderDaily}</p>
                    </div>
                </div>
                <div className="col-md-4">
                    <div
                        style={{
                            backgroundColor: "#86c7f3",
                            width: "100%",
                            height: "100px",
                            borderRadius: "10px",
                            padding: "15px",
                        }}
                    >
                        <h4 style={{ color: "white" }}>Current month sales</h4>
                        <p style={{ color: "white" }}>
                            {formatCurrency(currentMonthRevenue)}
                        </p>
                    </div>
                </div>
                <div className="col-md-4">
                    <div
                        style={{
                            backgroundColor: "#86c7f3",
                            width: "100%",
                            height: "100px",
                            borderRadius: "10px",
                            padding: "15px",
                        }}
                    >
                        <h4 style={{ color: "white" }}>Total revenue</h4>
                        <p style={{ color: "white" }}>
                            {formatCurrency(currentYearRevenue)}
                        </p>
                    </div>
                </div>
            </div>

            <div className="row mt-5">
                <div className="col-md-12 mb-3">
                    <DateRangePicker
                        onChange={(item) =>
                            setState([
                                {
                                    startDate: item.selection.startDate,
                                    endDate: item.selection.endDate,
                                    key: "selection",
                                },
                            ])
                        }
                        moveRangeOnFirstSelection={false}
                        months={2}
                        ranges={state}
                        direction="horizontal"
                    />
                </div>
                <div className="col-md-6 mt-3 mb-3">
                    <SalesChartByCategory
                        startDate={startDateStringState}
                        endDate={endDateStringState}
                    />
                </div>
                <div className="col-md-6 mt-3 mb-3">
                    <SalesChart salesData={salesData} />
                </div>

                <div className="col-md-6 mt-3 mb-3">
                    <PieChartMostSoldProduct />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;