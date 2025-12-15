import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './table';
import { Button } from './button';

interface DataTableProps {
  title?: string;
  description?: string;
  headerActions?: React.ReactNode;
  columns: Array<{
    key: string;
    label: string;
    align?: 'left' | 'right' | 'center';
    render?: (value: any, row: any) => React.ReactNode;
  }>;
  data: any[];
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    onPageChange: (page: number) => void;
  };
  emptyState?: React.ReactNode;
}

/**
 * Standardized Data Table Component
 * 
 * Features:
 * - Consistent spacing (8pt grid)
 * - Bordered table with rounded corners
 * - Built-in pagination
 * - Empty state support
 * - Proper alignment (text left, numbers right)
 * - Typography using design tokens
 */
export const DataTable: React.FC<DataTableProps> = ({
  title,
  description,
  headerActions,
  columns,
  data,
  pagination,
  emptyState,
}) => {
  return (
    <Card>
      {(title || headerActions) && (
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            {title && <CardTitle>{title}</CardTitle>}
            {description && (
              <p 
                className="text-muted-foreground mt-1"
                style={{ fontSize: 'var(--text-body-s)' }}
              >
                {description}
              </p>
            )}
          </div>
          {headerActions && <div>{headerActions}</div>}
        </CardHeader>
      )}
      
      <CardContent>
        {data.length === 0 ? (
          <div className="py-12 text-center">
            {emptyState || (
              <div>
                <p 
                  className="text-muted-foreground"
                  style={{ fontSize: 'var(--text-body-m)' }}
                >
                  No data available
                </p>
              </div>
            )}
          </div>
        ) : (
          <>
            {/* Table with border - 8pt grid aligned */}
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    {columns.map((column) => (
                      <TableHead
                        key={column.key}
                        className={
                          column.align === 'right' ? 'text-right' :
                          column.align === 'center' ? 'text-center' : ''
                        }
                      >
                        {column.label}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.map((row, rowIndex) => (
                    <TableRow key={rowIndex}>
                      {columns.map((column) => (
                        <TableCell
                          key={`${rowIndex}-${column.key}`}
                          className={
                            column.align === 'right' ? 'text-right' :
                            column.align === 'center' ? 'text-center' : ''
                          }
                          style={{ fontSize: 'var(--text-body-m)' }}
                        >
                          {column.render 
                            ? column.render(row[column.key], row)
                            : row[column.key]
                          }
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Pagination - Consistent 16px top margin (2 units) */}
            {pagination && (
              <div className="flex items-center justify-between mt-4">
                <p 
                  className="text-muted-foreground"
                  style={{ fontSize: 'var(--text-body-s)' }}
                >
                  Showing {((pagination.currentPage - 1) * pagination.itemsPerPage) + 1}-
                  {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)} of{' '}
                  {pagination.totalItems} items
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => pagination.onPageChange(pagination.currentPage - 1)}
                    disabled={pagination.currentPage === 1}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => pagination.onPageChange(pagination.currentPage + 1)}
                    disabled={pagination.currentPage === pagination.totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

/**
 * USAGE EXAMPLE:
 * 
 * <DataTable
 *   title="Items List"
 *   description="All inventory items"
 *   headerActions={<Button>Add Item</Button>}
 *   columns={[
 *     { key: 'id', label: 'ID' },
 *     { key: 'name', label: 'Name' },
 *     { key: 'quantity', label: 'Quantity', align: 'right' },
 *     { 
 *       key: 'status', 
 *       label: 'Status',
 *       render: (value) => <Badge>{value}</Badge>
 *     },
 *   ]}
 *   data={items}
 *   pagination={{
 *     currentPage: 1,
 *     totalPages: 10,
 *     totalItems: 100,
 *     itemsPerPage: 10,
 *     onPageChange: (page) => setPage(page),
 *   }}
 * />
 */
