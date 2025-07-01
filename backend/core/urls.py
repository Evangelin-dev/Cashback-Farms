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
    MaterialProductViewSet, SupportTicketViewSet, PlotPurchaseListView, PlotPurchaseCreateView, MicroPlotPurchaseListView, MicroPlotPurchaseCreateView,
    MaterialPurchaseListView, MaterialPurchaseCreateView, ServiceOrderListView, ServiceOrderCreateView,SubmitPlotInquiry, SubmitMicroPlotInquiry, 
    SubmitMaterialInquiry, SubmitServiceInquiry
)
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

# Create a router and register our viewsets with it.
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


support_ticket = SupportTicketViewSet.as_view({
    'get': 'retrieve',
    'put': 'update',
})


urlpatterns = [
    path('client/register/', UserRegistrationView.as_view(), name='register'),
    path('auth/request-otp/', OTPRequestView.as_view(), name='request-otp'),
    path('auth/verify-otp/', OTPVerificationAndLoginView.as_view(), name='verify-otp'),
    path('auth/login/', UserLoginView.as_view(), name='login'),
    path('auth/logout/', UserLogoutView.as_view(), name='logout'),
    path('agents/register/', RealEstateAgentRegistrationView.as_view(), name='agent-register'),
    path('', include(router.urls)),
    path('auth/jwt/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/jwt/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('referral/network/', ReferralNetworkView.as_view(), name='referral-network'),
    path('auth/user-register/', UserRegisterView.as_view(), name='user-register'),
    path('user/profile/', UserProfileView.as_view(), name='user-profile'),
    path('user/kyc/submit/', KYCSubmitView.as_view(), name='kyc-submit'),
    path('user/kyc/status/', KYCStatusView.as_view(), name='kyc-status'),
    path('user/kyc/update/', KYCUpdateView.as_view(), name='kyc-update'),
    path('micro-plots/', MicroPlotListView.as_view(), name='micro-plot-list'),
    path('micro-plots/<int:pk>/', MicroPlotDetailView.as_view(), name='micro-plot-detail'),
    path('api/', include(router.urls)),
    path('support/inquiry/', SupportTicketViewSet.as_view({'post': 'submit_ticket'}), name='support-inquiry'),
    path('support/my-tickets/', SupportTicketViewSet.as_view({'get': 'my_tickets'}), name='support-my-tickets'),
    path('support/ticket/<int:pk>/', support_ticket, name='support-ticket-detail'),
    path('purchase/plots/', PlotPurchaseListView.as_view(), name='purchase-plot-list'),
    path('purchase/plot/', PlotPurchaseCreateView.as_view(), name='purchase-plot-create'),
    path('purchase/micro-plots/', MicroPlotPurchaseListView.as_view(), name='micro-plot-purchase-list'),
    path('purchase/micro-plot/', MicroPlotPurchaseCreateView.as_view(), name='micro-plot-purchase'),
    path('purchase/materials/', MaterialPurchaseListView.as_view(), name='material-purchase-list'),
    path('purchase/material/', MaterialPurchaseCreateView.as_view(), name='material-purchase'),
     path('purchase/services/', ServiceOrderListView.as_view(), name='purchase-services'),
    path('purchase/service/', ServiceOrderCreateView.as_view(), name='purchase-service'),
    path('inquiry/plot/', SubmitPlotInquiry.as_view(), name='inquiry-plot'),
    path('inquiry/micro-plot/', SubmitMicroPlotInquiry.as_view(), name='inquiry-micro-plot'),
    path('inquiry/material/', SubmitMaterialInquiry.as_view(), name='inquiry-material'),
    path('inquiry/service/', SubmitServiceInquiry.as_view(), name='inquiry-service'),    
]
