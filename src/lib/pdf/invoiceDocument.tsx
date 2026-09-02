import fs from 'node:fs';
import path from 'node:path';
import { Document, Page, Text, View, Image, StyleSheet, renderToBuffer } from '@react-pdf/renderer';

const LOGO_SRC = { data: fs.readFileSync(path.join(process.cwd(), 'public', 'mejasan-logo.png')), format: 'png' as const };
const RED = '#c0392b';
const MUTED = '#666666';

export interface InvoiceLineItem {
  description: string;
  quantity: number;
  unit_price: number;
}

export interface InvoiceData {
  invoice_number: string;
  client_name: string;
  client_email: string;
  line_items: InvoiceLineItem[];
  subtotal: number;
  tax_rate: number;
  tax_amount: number;
  total_amount: number;
  currency: string;
  due_date: string | null;
  notes: string | null;
  status: string;
  created_at: string;
}

const styles = StyleSheet.create({
  page: { padding: 44, fontSize: 9, color: '#0a0a0a', fontFamily: 'Helvetica' },
  logo: { width: 90, height: 38, objectFit: 'contain', marginBottom: 8 },
  headRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 },
  title: { fontSize: 20, fontFamily: 'Helvetica-Bold' },
  meta: { fontSize: 9, color: MUTED, marginTop: 4 },
  status: { fontSize: 9, fontFamily: 'Helvetica-Bold', color: RED, textTransform: 'uppercase', marginTop: 6 },
  table: { borderWidth: 1, borderColor: '#ccc', marginTop: 12 },
  tRow: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#ccc' },
  tHead: { flexDirection: 'row', backgroundColor: '#f4f4f4', borderBottomWidth: 1, borderBottomColor: '#ccc' },
  tCellDesc: { flex: 3, padding: 8 },
  tCellNum: { flex: 1, padding: 8, textAlign: 'right' },
  tHeadText: { fontSize: 8, fontFamily: 'Helvetica-Bold', color: MUTED, textTransform: 'uppercase' },
  totalsBlock: { marginTop: 12, alignSelf: 'flex-end', width: 220 },
  totalsRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 },
  totalsLabel: { fontSize: 9, color: MUTED },
  totalsValue: { fontSize: 9 },
  grandRow: { flexDirection: 'row', justifyContent: 'space-between', paddingTop: 8, marginTop: 4, borderTopWidth: 1, borderTopColor: RED },
  grandLabel: { fontSize: 10, fontFamily: 'Helvetica-Bold' },
  grandValue: { fontSize: 12, fontFamily: 'Helvetica-Bold', color: RED },
  notes: { marginTop: 24, fontSize: 9, color: '#333', lineHeight: 1.5 },
  footer: { position: 'absolute', bottom: 30, left: 44, right: 44, textAlign: 'center' },
  footerRule: { borderBottomWidth: 1, borderBottomColor: RED, marginBottom: 6 },
  footerText: { fontSize: 7.5, fontFamily: 'Helvetica-Oblique', color: MUTED },
});

function money(n: number, currency: string) {
  return `${currency} ${n.toLocaleString('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function InvoicePdfDocument({ d }: { d: InvoiceData }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.headRow}>
          <View>
            <Image src={LOGO_SRC} style={styles.logo} />
            <Text style={{ fontSize: 8, color: MUTED }}>Mejasan Media Production · Kisumu, Kenya</Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={styles.title}>INVOICE</Text>
            <Text style={styles.meta}>{d.invoice_number}</Text>
            <Text style={styles.meta}>Issued: {new Date(d.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</Text>
            {d.due_date && <Text style={styles.meta}>Due: {new Date(d.due_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</Text>}
            <Text style={styles.status}>{d.status}</Text>
          </View>
        </View>

        <Text style={{ fontSize: 8, color: MUTED, textTransform: 'uppercase' }}>Billed To</Text>
        <Text style={{ fontSize: 11, fontFamily: 'Helvetica-Bold', marginTop: 2 }}>{d.client_name}</Text>
        <Text style={{ fontSize: 9, color: MUTED }}>{d.client_email}</Text>

        <View style={styles.table}>
          <View style={styles.tHead}>
            <Text style={[styles.tCellDesc, styles.tHeadText]}>Description</Text>
            <Text style={[styles.tCellNum, styles.tHeadText]}>Qty</Text>
            <Text style={[styles.tCellNum, styles.tHeadText]}>Unit Price</Text>
            <Text style={[styles.tCellNum, styles.tHeadText]}>Amount</Text>
          </View>
          {d.line_items.map((li, i) => (
            <View style={styles.tRow} key={i}>
              <Text style={styles.tCellDesc}>{li.description}</Text>
              <Text style={styles.tCellNum}>{li.quantity}</Text>
              <Text style={styles.tCellNum}>{money(li.unit_price, d.currency)}</Text>
              <Text style={styles.tCellNum}>{money(li.quantity * li.unit_price, d.currency)}</Text>
            </View>
          ))}
        </View>

        <View style={styles.totalsBlock}>
          <View style={styles.totalsRow}><Text style={styles.totalsLabel}>Subtotal</Text><Text style={styles.totalsValue}>{money(d.subtotal, d.currency)}</Text></View>
          {d.tax_rate > 0 && (
            <View style={styles.totalsRow}><Text style={styles.totalsLabel}>Tax ({d.tax_rate}%)</Text><Text style={styles.totalsValue}>{money(d.tax_amount, d.currency)}</Text></View>
          )}
          <View style={styles.grandRow}><Text style={styles.grandLabel}>Total</Text><Text style={styles.grandValue}>{money(d.total_amount, d.currency)}</Text></View>
        </View>

        {d.notes && <Text style={styles.notes}>{d.notes}</Text>}

        <View style={styles.footer} fixed>
          <View style={styles.footerRule} />
          <Text style={styles.footerText}>Mejasan Media Production · We Deliver Quality · Kisumu, Kenya</Text>
        </View>
      </Page>
    </Document>
  );
}

export async function renderInvoicePdf(data: InvoiceData): Promise<Buffer> {
  return renderToBuffer(<InvoicePdfDocument d={data} />);
}
