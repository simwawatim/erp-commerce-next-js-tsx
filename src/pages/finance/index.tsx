import Header from "../../../componets/header";
import SideNav from "../../../componets/side-nav";
import FinanceTable from "../../../componets/finance/table"

export default function Finance (){
    return (
        <div className="flex flex-col h-screen">
            {/* Top Header */}
            <Header />

            {/* Main content area: sidebar + content */}
            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar */}
                <aside className="w-64 bg-gray-100 border-r border-gray-300 overflow-y-auto">
                    <SideNav />
                </aside>

                {/* Main Content */}
                <main className="flex-1 p-6 bg-white overflow-y-auto">
                    <FinanceTable />
                </main>
            </div>
        </div>
    );
}
