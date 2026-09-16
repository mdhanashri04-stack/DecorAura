import random
import string
from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.models import Order, OrderItem, Product
from backend.schemas import OrderResponse, OrderCreate, OrderStatusUpdate

router = APIRouter(prefix="/api/orders", tags=["Orders"])

def generate_order_number():
    rand_str = ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))
    return f"DA-{rand_str}"

@router.get("", response_model=List[OrderResponse])
def get_orders(db: Session = Depends(get_db)):
    return db.query(Order).order_by(Order.created_at.desc()).all()

@router.get("/{order_id}", response_model=OrderResponse)
def get_order(order_id: int, db: Session = Depends(get_db)):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=444, detail="Order not found")
    return order

@router.post("", response_model=OrderResponse, status_code=201)
def create_order(order_in: OrderCreate, db: Session = Depends(get_db)):
    if not order_in.items:
        raise HTTPException(status_code=400, detail="Order must contain at least one item")

    total_amount = 0.0
    db_items = []

    for item in order_in.items:
        product = db.query(Product).filter(Product.id == item.product_id).first()
        if not product:
            raise HTTPException(status_code=444, detail=f"Product ID {item.product_id} not found")
        
        item_price = product.price
        total_amount += item_price * item.quantity
        
        db_items.append(
            OrderItem(
                product_id=product.id,
                quantity=item.quantity,
                price=item_price
            )
        )

    db_order = Order(
        order_number=generate_order_number(),
        customer_name=order_in.customer_name,
        customer_email=order_in.customer_email,
        total_amount=round(total_amount, 2),
        status="Processing",
        payment_method=order_in.payment_method or "Mock Checkout",
        shipping_address=order_in.shipping_address,
        items=db_items
    )

    db.add(db_order)
    db.commit()
    db.refresh(db_order)
    return db_order

@router.put("/{order_id}/status", response_model=OrderResponse)
def update_order_status(order_id: int, status_in: OrderStatusUpdate, db: Session = Depends(get_db)):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=444, detail="Order not found")

    order.status = status_in.status
    db.commit()
    db.refresh(order)
    return order
