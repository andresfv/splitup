/**
 * Definiciones de tipos TypeScript para la aplicación.
 * Estas definiciones son globales y pueden ser utilizadas en cualquier parte de la aplicación.
 * 
 */
export { };
declare global {

    /**
     * Representa un miembro que participa en las compras compartidas.
     */
    interface Member {
        id: number;
        name: string;
        active: boolean;
    }

    /**
     * Representa un lugar donde se realizan las compras.
     */
    interface Place {
        id: number;
        name: string;
    }

    /**
     * Representa una compra realizada en un lugar específico durante una semana determinada.
     */
    interface Bill {
        id: number;
        placeId: number;
        amount: number;
        date: Date;
    }

    /**
     * Representa la relación entre una compra y un miembro, incluyendo la cantidad que le corresponde pagar al miembro.
     */
    interface BillMember {
        id: number;
        billId: number;
        memberId: number;
        amount: number;
        isPaid: boolean;
    }

    /**
     * Representa un ítem de factura que se muestra en la UI, 
     * incluyendo el nombre del lugar, la fecha, el monto y si está pagado o no.
     */
    interface BillMemberDetailsDTO {
        id: number;
        placeName: string;
        date: Date;
        amount: number;
        isPaid: boolean;
    }


    interface BillDetailsDTO {
        id: number;
        placeName: string;
        date: Date;
        totalAmount: number;
        paidAmount: number;
        pendingAmount: number;
    }

    /**
     * Representa un resumen de las facturas por persona, incluyendo 
     * el total, lo pagado, lo pendiente y la cantidad de facturas.
     * No BD, solo para mostrar en la UI.
     */
    interface BillSummaryDTO {
        total: number;
        paid: number;
        pending: number;
        count: number;
    }
}