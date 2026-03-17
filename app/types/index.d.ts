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
        isPaid: boolean;
        date: Date;
    }

    /**
     * Representa la relación entre una compra y un miembro, incluyendo la cantidad que le corresponde pagar al miembro.
     */
    interface BillMember {
        billId: number;
        memberId: number;
        shareAmount: number;
    }
}