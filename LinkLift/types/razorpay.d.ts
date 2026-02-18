declare module 'razorpay' {
    interface RazorpayOptions {
        key_id: string;
        key_secret: string;
        headers?: Record<string, string>;
    }

    interface RazorpayOrderOptions {
        amount: number | string;
        currency: string;
        receipt?: string;
        payment_capture?: boolean | 0 | 1;
        notes?: Record<string, string | number>;
        partial_payment?: boolean;
        [key: string]: any;
    }

    interface RazorpayOrder {
        id: string;
        entity: string;
        amount: number;
        amount_paid: number;
        amount_due: number;
        currency: string;
        receipt: string;
        offer_id: string | null;
        status: string;
        attempts: number;
        notes: Record<string, string | number>;
        created_at: number;
        [key: string]: any;
    }

    class Razorpay {
        constructor(options: RazorpayOptions);
        orders: {
            create(options: RazorpayOrderOptions): Promise<RazorpayOrder>;
            fetch(orderId: string): Promise<RazorpayOrder>;
            all(options?: any): Promise<{ count: number; items: RazorpayOrder[] }>;
        };
        // Add other methods as needed
    }

    export = Razorpay;
}
