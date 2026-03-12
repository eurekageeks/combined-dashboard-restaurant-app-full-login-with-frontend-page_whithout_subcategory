from fastapi import APIRouter, HTTPException
from app.db.mongo import users_collection, categories_collection, sub_categories_collection
from bson import ObjectId
from app.models.user_models import SignupRequest, LoginRequest
from app.utils.security import hash_password, verify_password, create_access_token
from fastapi import Body
router = APIRouter(prefix="/auth", tags=["Auth"])


@router.post("/signup")
def signup(data: SignupRequest):

    user_data = {
        "email": data.email,
        "mobile": data.mobile,
        "password": hash_password(data.password),
        "role": data.role
    }

    if data.role == "vendor":

        # Existing category
        if data.category_id:
            user_data["category_id"] = ObjectId(data.category_id)

            category = categories_collection.find_one(
                {"_id": ObjectId(data.category_id)}
            )
            if category:
                user_data["category_name"] = category.get("name")

        # Custom category (Not In List)
        elif data.category:
            user_data["category_name"] = data.category

        # Existing sub category
        if data.sub_category_id:
            user_data["sub_category_id"] = ObjectId(data.sub_category_id)

            sub_category = sub_categories_collection.find_one(
                {"_id": ObjectId(data.sub_category_id)}
            )
            if sub_category:
                user_data["sub_category_name"] = sub_category.get("name")

        # Custom sub category
        elif data.sub_category:
            user_data["sub_category_name"] = data.sub_category

    users_collection.insert_one(user_data)

    return {"message": "Signup successful"}
@router.post("/login")
def login(data: LoginRequest):
    user = users_collection.find_one({"email": data.email})
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    if not verify_password(data.password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    access_token = create_access_token({
        "sub": user["email"],
        "role": user["role"]
    })

    # ✅ EXACT STRUCTURE FRONTEND EXPECTS
    return {
        "access_token": access_token,
        "user": {
            "email": user["email"],
            "role": user["role"]
        }
    }

from bson import ObjectId

@router.get("/vendors")
def get_vendors():

    vendors = list(users_collection.find({"role": "vendor"}))
    vendor_list = []

    for v in vendors:

        category_name = v.get("category_name")
        sub_category_name = v.get("sub_category_name")

        # If names are not stored, fetch from category collections
        if not category_name and v.get("category_id"):
            category = categories_collection.find_one(
                {"_id": ObjectId(v["category_id"])}
            )
            if category:
                category_name = category.get("name")

        if not sub_category_name and v.get("sub_category_id"):
            sub_category = sub_categories_collection.find_one(
                {"_id": ObjectId(v["sub_category_id"])}
            )
            if sub_category:
                sub_category_name = sub_category.get("name")

        vendor_list.append({
            "id": str(v["_id"]),
            "email": v.get("email"),
            "mobile": v.get("mobile"),
            "category_name": category_name,
            "sub_category_name": sub_category_name
        })

    return vendor_list

@router.delete("/vendor/{vendor_id}")
def delete_vendor(vendor_id: str):

    users_collection.delete_one({"_id": ObjectId(vendor_id)})

    return {"message": "Vendor deleted successfully"}

from bson import ObjectId

@router.get("/vendor/{vendor_id}")
def get_vendor(vendor_id: str):

    vendor = users_collection.find_one({"_id": ObjectId(vendor_id)})

    if not vendor:
        return {"error": "Vendor not found"}

    category_name = vendor.get("category_name")
    sub_category_name = vendor.get("sub_category_name")

    # If category name not stored, fetch from category collection
    if not category_name and vendor.get("category_id"):
        category = categories_collection.find_one(
            {"_id": ObjectId(vendor["category_id"])}
        )
        if category:
            category_name = category.get("name")

    # If subcategory name not stored, fetch from subcategory collection
    if not sub_category_name and vendor.get("sub_category_id"):
        sub_category = sub_categories_collection.find_one(
            {"_id": ObjectId(vendor["sub_category_id"])}
        )
        if sub_category:
            sub_category_name = sub_category.get("name")

    return {
        "email": vendor.get("email"),
        "mobile": vendor.get("mobile"),
        "category_name": category_name,
        "sub_category_name": sub_category_name
    }
@router.put("/vendor/{vendor_id}")
def update_vendor(vendor_id: str, data: dict = Body(...)):

    users_collection.update_one(
        {"_id": ObjectId(vendor_id)},
        {"$set": data}
    )

    return {"message": "Vendor updated successfully"}