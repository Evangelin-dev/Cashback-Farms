# core/urls.py

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    PlotListingViewSet, JointOwnerViewSet, BookingViewSet,
    EcommerceProductViewSet, OrderViewSet, OrderItemViewSet,
    RealEstateAgentProfileViewSet, RealEstateAgentRegistrationView,
    UserRegistrationView, OTPRequestView, OTPVerificationAndLoginView,
    UserLoginView, UserLogoutView, ReferralNetworkView,
    SQLFTProjectViewSet, PlotInquiryViewSet, BankDetailViewSet, UserRegisterView, UserProfileView,
    KYCSubmitView, KYCStatusView, KYCUpdateView, MicroPlotListView, MicroPlotDetailView, FAQViewSet,
    MaterialProductViewSet, SupportTicketViewSet, PlotPurchaseListView, PlotPurchaseCreateView,
    MicroPlotPurchaseListView, MicroPlotPurchaseCreateView, MaterialPurchaseListView,
    MaterialPurchaseCreateView, ServiceOrderListView, ServiceOrderCreateView, SubmitPlotInquiry,
    SubmitMicroPlotInquiry, SubmitMaterialInquiry, SubmitServiceInquiry, AllBookingListView,
    MyBookingListView, BookingByClientIDView, PublicPlotDetailView, PublicPlotListView,
    PublicMicroPlotListView, PublicMaterialListView, PublicMaterialDetailView, PublicMicroPlotDetailView,
    PublicServiceDetailView, PublicServiceListView, MyPaymentsView,
    UpdateCartItemView, AddToCartView, CartView, RemoveCartItemView, ClearCartView, CheckoutCartView,
    UpdateOrderStatusView, WebOrderViewSet, CallRequestCreateView, ToggleCustomerStatusView,
    B2BCustomerListView, B2BVendorProfileView, VendorPaymentSummaryView, VendorPaymentHistoryView,
    InterestedUsersView
)
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

# Routers
router = DefaultRouter()
router.register(r'plots', PlotListingViewSet, basename='plot')
router.register(r'joint-owners', JointOwnerViewSet)
router.register(r'bookings', BookingViewSet)
router.register(r'products', EcommerceProductViewSet)
router.register(r'orders', OrderViewSet)
router.register(r'order-items', OrderItemViewSet)
router.register(r'agents', RealEstateAgentProfileViewSet)
router.register(r'sqlft-projects', SQLFTProjectViewSet)
router.register(r'plot-inquiries', PlotInquiryViewSet)
router.register(r'bank-details', BankDetailViewSet)
router.register(r'materials', MaterialProductViewSet, basename='materials')
router.register(r'ecommerce/materials', MaterialProductViewSet, basename='ecommerce-materials')
router.register(r'ecommerce/services', EcommerceProductViewSet, basename='ecommerce-services')
router.register(r'faqs', FAQViewSet, basename='faq')
router.register(r'web/orders', WebOrderViewSet, basename='web-orders')

# ViewSet-as-view usage
support_ticket = SupportTicketViewSet.as_view({'get': 'retrieve', 'put': 'update'})

urlpatterns = [
    # Auth
    path('auth/jwt/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/jwt/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/request-otp/', OTPRequestView.as_view(), name='request-otp'),
    path('auth/verify-otp/', OTPVerificationAndLoginView.as_view(), name='verify-otp'),
    path('auth/login/', UserLoginView.as_view(), name='login'),
    path('auth/logout/', UserLogoutView.as_view(), name='logout'),

    # User Registration
    path('client/register/', UserRegistrationView.as_view(), name='register'),
    path('agents/register/', RealEstateAgentRegistrationView.as_view(), name='agent-register'),
    path('auth/user-register/', UserRegisterView.as_view(), name='user-register'),
    path('user/profile/', UserProfileView.as_view(), name='user-profile'),

    # KYC
    path('user/kyc/submit/', KYCSubmitView.as_view(), name='kyc-submit'),
    path('user/kyc/status/', KYCStatusView.as_view(), name='kyc-status'),
    path('user/kyc/update/', KYCUpdateView.as_view(), name='kyc-update'),

    # Referral
    path('referral/network/', ReferralNetworkView.as_view(), name='referral-network'),

    # Public APIs
    path('public/plots/', PublicPlotListView.as_view(), name='public-plot-list'),
    path('public/plots/<int:pk>/', PublicPlotDetailView.as_view(), name='public-plot-detail'),
    path('public/materials/', PublicMaterialListView.as_view(), name='public-materials'),
    path('public/materials/<int:pk>/', PublicMaterialDetailView.as_view(), name='public-material-detail'),
    path('public/micro-plots/', PublicMicroPlotListView.as_view(), name='public-micro-plot-list'),
    path('public/micro-plots/<int:pk>/', PublicMicroPlotDetailView.as_view(), name='public-micro-plot-detail'),
    path('public/services/', PublicServiceListView.as_view(), name='public-service-list'),
    path('public/services/<int:pk>/', PublicServiceDetailView.as_view(), name='public-service-detail'),

    # Microplots
    path('micro-plots/', MicroPlotListView.as_view(), name='micro-plot-list'),
    path('micro-plots/<int:pk>/', MicroPlotDetailView.as_view(), name='micro-plot-detail'),

    # Inquiries
    path('inquiry/plot/', SubmitPlotInquiry.as_view(), name='inquiry-plot'),
    path('inquiry/micro-plot/', SubmitMicroPlotInquiry.as_view(), name='inquiry-micro-plot'),
    path('inquiry/material/', SubmitMaterialInquiry.as_view(), name='inquiry-material'),
    path('inquiry/service/', SubmitServiceInquiry.as_view(), name='inquiry-service'),

    # Bookings
    path('bookings/', AllBookingListView.as_view(), name='all-bookings'),
    path('bookings/my/', MyBookingListView.as_view(), name='my-bookings'),
    path('bookings/client/<int:client_id>/', BookingByClientIDView.as_view(), name='bookings-by-client'),
    path('my/bookings/', MyBookingListView.as_view(), name='my-bookings'),

    # Payments
    path('my-payments/', MyPaymentsView.as_view(), name='my-payments'),
    path('vendor/payments/summary/', VendorPaymentSummaryView.as_view(), name='vendor-payment-summary'),
    path('vendor/payments/history/', VendorPaymentHistoryView.as_view(), name='vendor-payment-history'),

    # Purchase
    path('purchase/plots/', PlotPurchaseListView.as_view(), name='purchase-plot-list'),
    path('purchase/plot/', PlotPurchaseCreateView.as_view(), name='purchase-plot-create'),
    path('purchase/micro-plots/', MicroPlotPurchaseListView.as_view(), name='micro-plot-purchase-list'),
    path('purchase/micro-plot/', MicroPlotPurchaseCreateView.as_view(), name='micro-plot-purchase'),
    path('purchase/materials/', MaterialPurchaseListView.as_view(), name='material-purchase-list'),
    path('purchase/material/', MaterialPurchaseCreateView.as_view(), name='material-purchase'),
    path('purchase/services/', ServiceOrderListView.as_view(), name='purchase-services'),
    path('purchase/service/', ServiceOrderCreateView.as_view(), name='purchase-service'),

    # Cart
    path('cart/', CartView.as_view(), name='cart-view'),
    path('cart/add/', AddToCartView.as_view(), name='cart-add'),
    path('cart/update-item/<int:id>/', UpdateCartItemView.as_view(), name='cart-update'),
    path('cart/remove-item/<int:id>/', RemoveCartItemView.as_view(), name='remove-cart-item'),
    path('cart/clear/', ClearCartView.as_view(), name='clear-cart'),
    path('cart/checkout/', CheckoutCartView.as_view(), name='checkout-cart'),

    # Orders
    path('orders/<int:pk>/update-status/', UpdateOrderStatusView.as_view(), name='update-order-status'),

    # Support
    path('support/inquiry/', SupportTicketViewSet.as_view({'post': 'submit_ticket'}), name='support-inquiry'),
    path('support/my-tickets/', SupportTicketViewSet.as_view({'get': 'my_tickets'}), name='support-my-tickets'),
    path('support/ticket/<int:pk>/', support_ticket, name='support-ticket-detail'),

    # B2B
    path('b2b/call-requests/', B2BCustomerListView.as_view(), name='b2b-call-requests'),
    path('b2b/customer/<int:pk>/toggle-status/', ToggleCustomerStatusView.as_view(), name='b2b-customer-toggle-status'),
    path('b2b/profile/', B2BVendorProfileView.as_view(), name='b2b-profile'),

    # Lead API (✅ The one you asked)
    path('agents/interested-users/', InterestedUsersView.as_view(), name='interested-users'),

    # Other
    path('call-request/', CallRequestCreateView.as_view(), name='call-request'),

    # ✅ Include all router-based viewsets
    path('', include(router.urls)),
]
