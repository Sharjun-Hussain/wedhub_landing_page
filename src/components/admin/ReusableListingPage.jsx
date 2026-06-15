"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Package } from "lucide-react";
import { AdminLayout } from "@/components/admin/admin-layout";
import DataTable from "@/components/admin/DataTable";
import { useAuth } from "@/States/auth-context";
import { useRouter } from "next/navigation";
export default function ReusableListingPage({
  // Required props
  title,
  description,
  data,
  columns,
  // Optional props with defaults
  stats = [],
  bulkActions = [],
  searchableColumns = [],
  filterableColumns = [],
  emptyState = null,
  defaultSortField = "createdAt",
  defaultSortDirection = "desc",
  // Callbacks
  onBulkAction,
  onRowClick,
  // UI customization
  headerRightContent = null,
  // Layout
  showStats = true,
  showHeader = true,
  // Permissions
  requireWritePermission = true,
}) {
  const { hasPermission } = useAuth();
  const router = useRouter();

  // Check if user has permission to perform bulk actions
  const canPerformBulkActions =
    !requireWritePermission || hasPermission("orders.write");

  // Default empty state component
  const defaultEmptyState = (
    <div className="text-center py-8">
      <Package className="mx-auto h-12 w-12 text-gray-400" />
      <h3 className="mt-2 text-sm font-medium text-gray-900">No data found</h3>
      <p className="mt-1 text-sm text-gray-500">
        Try adjusting your search or filters.
      </p>
    </div>
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        {showHeader && (
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-200">
                {title}
              </h1>
              {description && (
                <p className="text-gray-900 dark:text-gray-200 mt-1">
                  {description}
                </p>
              )}
            </div>
            {headerRightContent}
          </div>
        )}

        {/* Stats */}
        {showStats && stats.length > 0 && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => (
              <Card key={stat.title || index}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {stat.title}
                  </CardTitle>
                  {stat.icon && <stat.icon className="h-4 w-4 text-primary" />}
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  {stat.description && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {stat.description}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Data Table */}
        <Card>
          <CardHeader>
            <CardTitle>{title} Management</CardTitle>
            {description && <CardDescription>{description}</CardDescription>}
          </CardHeader>
          <CardContent>
            <DataTable
              data={data}
              columns={columns}
              searchableColumns={searchableColumns}
              filterableColumns={filterableColumns}
              bulkActions={canPerformBulkActions ? bulkActions : []}
              onBulkAction={onBulkAction}
              onRowClick={onRowClick}
              defaultSortField={defaultSortField}
              defaultSortDirection={defaultSortDirection}
              emptyState={emptyState || defaultEmptyState}
            />
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
